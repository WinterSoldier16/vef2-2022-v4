import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import xss from 'xss';
import { query } from '../lib/db.js';

dotenv.config();

const { BCRYPT_ROUNDS: bcryptRounds = 1 } = process.env;

export async function createUser(name, username, password) {
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(bcryptRounds, 10)
  );

  const q = `
    INSERT INTO
      users (name, username, password)
    VALUES
      ($1, $2, $3)
    RETURNING *`;

  const values = [xss(name), xss(username), hashedPassword];
  const result = await query(q, values);

  if (result) {
    return result.rows[0];
  }

  console.warn('unable to create user');

  return false;
}

export async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}

export async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  const result = await query(q, [username]);

  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  return false;
}

export async function findByEmail(email) {
  const q = 'SELECT * FROM users WHERE email = $1';

  const result = await query(q, [email]);

  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  console.warn('unable to query user by email', email);
  return null;
}

export async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  const result = await query(q, [id]);

  if (result && result.rowCount === 1) {
    return result.rows[0];
  }

  console.error('unable to find user by id', id);

  return null;
}
