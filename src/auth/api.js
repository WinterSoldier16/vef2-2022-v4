import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { addPageMetadata } from '../lib/addPageMetadata.js';
import { catchErrors } from '../lib/catchErrors.js';
import { pagedQuery } from '../lib/db.js';
import { validationCheck } from '../lib/validationCheck.js';
import { pagingQuerystringValidator } from '../lib/validators.js';
import { jwtOptions, requireAuthentication, tokenOptions } from './passport.js';
import {
  comparePasswords,
  createUser,
  findById,
  findByUsername,
} from './users.js';

export const router = express.Router();

async function registerRoute(req, res) {
  const { name, username, password = '' } = req.body;

  const result = await createUser(name, username, password);

  if (!result) {
    return res.status(500).json({ error: 'unable to create user' });
  }

  delete result.password;

  return res.status(201).json(result);
}

async function loginRoute(req, res) {
  const { username, password = '' } = req.body;

  const user = await findByUsername(username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid user/password' });
  }

  const passwordIsCorrect = await comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    const payload = { id: user.id };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({
      user,
      token,
      expiresIn: tokenOptions.expiresIn,
    });
  }

  return res.status(401).json({ error: 'Invalid user/password' });
}

async function currentUserRoute(req, res) {
  const { user: { id } = {} } = req;

  const user = await findById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  delete user.password;

  return res.json(user);
}

const registerValidation = [
  body('username')
    .isLength({ min: 1, max: 64 })
    .withMessage('username is required, max 256 characters'),
  body('name')
    .isLength({ min: 1, max: 64 })
    .withMessage('name is required, max 128 characters'),
  body('password')
    .isLength({ min: 10, max: 256 })
    .withMessage('password is required, max 256 characters'),
  body('username').custom(async (username) => {
    const user = await findByUsername(username);
    if (user) {
      return Promise.reject(new Error('username already exists'));
    }
    return Promise.resolve();
  }),
];

async function listUsers(req, res) {
  const { offset = 0, limit = 10 } = req.query;

  const users = await pagedQuery(
    `SELECT
        id, name, username, admin, created
      FROM
        users
      ORDER BY id ASC`,
    [],
    { offset, limit }
  );

  if (!users) {
    return res.status(500).json({ error: 'unable to list users' });
  }

  const usersWithPage = addPageMetadata(users, req.path, {
    offset,
    limit,
    length: users.items.length,
  });

  return res.json(usersWithPage);
}

router.post(
  '/users/register',
  registerValidation,
  validationCheck,
  catchErrors(registerRoute)
);

router.post('/users/login', catchErrors(loginRoute));

router.get('/users/me', requireAuthentication, catchErrors(currentUserRoute));

router.get(
  '/users',
  requireAuthentication,
  pagingQuerystringValidator,
  validationCheck,
  catchErrors(listUsers)
);

async function returnUser(req, res) {
  const { id } = req.params;

  const user = await findById(id);

  if (!user) {
    return res.status(404).json({});
  }

  delete user.password;
  return res.status(200).json(user);
}

router.get('/users/:id', requireAuthentication, catchErrors(returnUser));
