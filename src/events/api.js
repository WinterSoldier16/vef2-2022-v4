import express from 'express';
import { body } from 'express-validator';
import xss from 'xss';
import { requireAuthentication } from '../auth/passport.js';
import { findById } from '../auth/users.js';
import { addPageMetadata } from '../lib/addPageMetadata.js';
import { catchErrors } from '../lib/catchErrors.js';
import { conditionalUpdate, pagedQuery } from '../lib/db.js';
import { slugify } from '../lib/slugify.js';
import { validationCheck } from '../lib/validationCheck.js';
import {
  atLeastOneBodyValueValidator,
  pagingQuerystringValidator,
} from '../lib/validators.js';
import {
  createEvent as createEventFromDb,
  deleteEvent as deleteEventFromDb,
  deleteRegistrationForUser,
  findRegistrationForUser,
  listEvent as listEventFromDb,
  listRegistered,
  register,
} from './events.js';
import {
  registrationValidationMiddleware,
  sanitizationMiddleware,
  xssSanitizationMiddleware,
} from './validation.js';

export const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    events: {
      events: {
        href: '/events',
        methods: ['GET', 'POST'],
      },
      event: {
        href: '/events/{id}',
        methods: ['GET', 'PATCH', 'DELETE'],
      },
      register: {
        href: '/events/{id}/register',
        methods: ['PATCH', 'DELETE'],
      },
    },
    users: {
      users: {
        href: '/users',
        methods: ['GET'],
      },
      user: {
        href: '/users/{id}',
        methods: ['GET'],
      },
      register: {
        href: '/users/register',
        methods: ['POST'],
      },
      login: {
        href: '/users/login',
        methods: ['POST'],
      },
      me: {
        href: '/users/me',
        methods: ['GET'],
      },
    },
  });
});

async function listEvents(req, res) {
  const { offset = 0, limit = 10 } = req.query;

  const events = await pagedQuery(
    `SELECT
          id, name, slug, description, created, updated
        FROM
          events
        ORDER BY updated ASC`,
    [],
    { offset, limit }
  );

  if (!events) {
    return res.status(500).json({ error: 'unable to list events' });
  }

  const eventsWithPage = addPageMetadata(events, req.path, {
    offset,
    limit,
    length: events.items.length,
  });

  return res.json(eventsWithPage);
}

async function listEvent(req, res) {
  const { id } = req.params;

  const event = await listEventFromDb(id);

  if (!event) {
    return res.status(404).json({});
  }

  // Viðbót fyrir v4!
  const registrations = await listRegistered(id);
  event.registrations = registrations;

  return res.status(200).json(event);
}

async function createEvent(req, res) {
  const { name, description } = req.body;
  const { id } = req.user;
  const slug = slugify(name);

  const created = await createEventFromDb({
    name,
    slug,
    description,
    user: id,
  });

  if (created) {
    return res.status(201).json(created);
  }

  return res.status(500).json({ error: 'unable to create event ' });
}

function isString(s) {
  return typeof s === 'string';
}

async function patchEvent(req, res) {
  const { id: eventId } = req.params;
  const { id: userId } = req.user;
  const { name, description } = req.body;

  const event = await listEventFromDb(eventId);
  const user = await findById(userId);

  if (!event) {
    return res.status(404).json({});
  }

  if (event.creatorid !== userId && !user.admin) {
    return res.status(401).json({ error: 'not creator or admin' });
  }

  const fields = [
    isString(name) ? 'name' : null,
    isString(name) ? 'slug' : null,
    isString(description) ? 'description' : null,
  ];

  const values = [
    isString(name) ? xss(name) : null,
    isString(name) ? xss(slugify(name)) : null,
    isString(description) ? xss(description) : null,
  ];

  const result = await conditionalUpdate('events', eventId, fields, values);

  if (!result) {
    return res.status(500).json({ error: 'unable to update' });
  }

  return res.status(200).json(result.rows[0]);
}

async function deleteEvent(req, res) {
  const { id: eventId } = req.params;
  const { id: userId } = req.user;

  const event = await listEventFromDb(eventId);
  const user = await findById(userId);

  if (!event) {
    return res.status(404).json({});
  }

  if (event.creatorid !== userId && !user.admin) {
    return res.status(401).json({ error: 'not creator or admin' });
  }

  const result = await deleteEventFromDb(eventId);

  if (!result) {
    return res.status(500).json({ error: 'unable to delete' });
  }

  return res.status(200).json({});
}

async function registerEvent(req, res) {
  const { comment } = req.body;
  const { id: eventId } = req.params;
  const { id: userId } = req.user;

  const event = await listEventFromDb(eventId);
  const user = await findById(userId);

  if (!event || !user) {
    return res.status(404).json({});
  }

  const result = await register({ userId, eventId, comment });

  if (!result) {
    return res.status(500).json({ error: 'unable to register' });
  }

  return res.status(201).json(result);
}

async function deleteEventRegistration(req, res) {
  const { id: eventId } = req.params;
  const { id: userId } = req.user;

  const registration = await findRegistrationForUser({
    userId,
    eventId: Number.parseInt(eventId, 10),
  });

  if (!registration || registration.length === 0) {
    return res.status(404).json({});
  }

  const result = await deleteRegistrationForUser({ userId, eventId });

  if (!result) {
    return res.status(500).json({ error: 'unable to register' });
  }

  return res.status(200).json({});
}

router.get(
  '/events',
  pagingQuerystringValidator,
  validationCheck,
  catchErrors(listEvents)
);

router.post(
  '/events',
  requireAuthentication,
  registrationValidationMiddleware('description'),
  xssSanitizationMiddleware('description'),
  validationCheck,
  sanitizationMiddleware('description'),
  catchErrors(createEvent)
);

router.get('/events/:id', catchErrors(listEvent));

// TODO validaiton
router.patch(
  '/events/:id',
  requireAuthentication,
  registrationValidationMiddleware('description'),
  xssSanitizationMiddleware('description'),
  atLeastOneBodyValueValidator(['name', 'description']),
  validationCheck,
  sanitizationMiddleware('description'),
  catchErrors(patchEvent)
);

router.delete('/events/:id', requireAuthentication, catchErrors(deleteEvent));

router.post(
  '/events/:id/register',
  requireAuthentication,
  body('comment')
    .isLength({ max: 400 })
    .withMessage('comment max 400 characters'),
  body('comment').customSanitizer((v) => xss(v)),
  validationCheck,
  sanitizationMiddleware('comment'),
  catchErrors(registerEvent)
);

router.delete(
  '/events/:id/register',
  requireAuthentication,
  catchErrors(deleteEventRegistration)
);
