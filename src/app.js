import dotenv from 'dotenv';
import express from 'express';
import { router as usersRoutes } from './auth/api.js';
import passport from './auth/passport.js';
import { router as eventRoutes } from './events/api.js';
import { cors } from './lib/cors.js';

dotenv.config();

const { PORT: port = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use(cors);
app.use(eventRoutes);
app.use(usersRoutes);

app.use((req, res) => {
  console.warn('Not found', req.originalUrl);
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Grípum illa formað JSON og sendum 400 villu til notanda
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
