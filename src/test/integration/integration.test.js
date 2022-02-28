import { describe, expect, test } from '@jest/globals';
import {
  createRandomUserAndReturnWithToken,
  deleteAndParse,
  fetchAndParse,
  patchAndParse,
  postAndParse,
  randomValue,
} from './utils';

describe('integration', () => {
  describe('/events', () => {
    test('GET /events returns 200', async () => {
      const { status } = await fetchAndParse('/events/');
      expect(status).toBe(200);
    });

    test('POST /events returns 201 and gets it by id', async () => {
      const { token } = await createRandomUserAndReturnWithToken();
      const name = `event${randomValue()}`;

      const { result, status } = await postAndParse('/events', { name }, token);
      expect(status).toBe(201);
      expect(result.name).toBe(name);
    });

    test('GET /events/:id with newly created event', async () => {
      const { token } = await createRandomUserAndReturnWithToken();
      const name = `event${randomValue()}`;

      const { result } = await postAndParse('/events', { name }, token);

      const event = await fetchAndParse(`/events/${result.id}`);
      expect(event.status).toBe(200);
      expect(event.result.name).toBe(name);
    });

    test('PATCH /events/:id', async () => {
      const { token } = await createRandomUserAndReturnWithToken();
      const name = `event${randomValue()}`;

      const { result } = await postAndParse('/events', { name }, token);

      expect(result.description).toBe('');

      const event = await patchAndParse(
        `/events/${result.id}`,
        {
          description: '123',
        },
        token
      );

      expect(event.status).toBe(200);
      expect(event.result.description).toBe('123');
    });

    test('DELETE /events/:id', async () => {
      const { token } = await createRandomUserAndReturnWithToken();
      const name = `event${randomValue()}`;

      const { result } = await postAndParse('/events', { name }, token);

      expect(result.description).toBe('');

      const event = await deleteAndParse(`/events/${result.id}`, null, token);

      expect(event.status).toBe(200);
      expect(event.result).toEqual({});
    });
  });

  describe('registration', () => {
    test('POST /events/:id/registration for a valid user', async () => {
      const { user, token } = await createRandomUserAndReturnWithToken();
      const name = `event${randomValue()}`;

      const { result } = await postAndParse('/events', { name }, token);

      const comment = 'comment';
      const data = { comment };
      const registration = await postAndParse(
        `/events/${result.id}/register`,
        data,
        token
      );

      expect(registration.status).toBe(201);
      expect(registration.result.userid).toBe(user.id);
      expect(registration.result.event).toBe(result.id);
    });

    test('DELETE /events/:id/registration for a valid registration', async () => {
      const { token } = await createRandomUserAndReturnWithToken();
      const name = `event${randomValue()}`;

      const { result } = await postAndParse('/events', { name }, token);

      await postAndParse(`/events/${result.id}/register`, null, token);

      const deleteRegistration = await deleteAndParse(
        `/events/${result.id}/register`,
        null,
        token
      );

      expect(deleteRegistration.status).toBe(200);
      expect(deleteRegistration.result).toEqual({});
    });
  });

  describe('users', () => {
    const name = 'test notandi';
    const username = `user${randomValue()}`;
    const password = '1234567890';

    test('GET /users w/no token returns 401', async () => {
      const { status } = await fetchAndParse('/users/');
      expect(status).toBe(401);
    });

    test('returns 401 for /users/1 if no token', async () => {
      const { status } = await fetchAndParse('/users/1');
      expect(status).toBe(401);
    });

    test('POST /users/register returns 201', async () => {
      const data = { name, username, password };

      const { result, status } = await postAndParse('/users/register', data);

      expect(status).toBe(201);
      expect(result.name).toBe(name);
      expect(result.username).toBe(username);
    });

    test('POST /users/login returns 200 for valid user', async () => {
      const loginData = { username, password };

      const { status } = await postAndParse('/users/login', loginData);
      expect(status).toBe(200);
    });

    test('POST /users/me returns 200 and info about valid user', async () => {
      const loginData = { username, password };

      const { result, status } = await postAndParse('/users/login', loginData);
      const { token } = result;

      expect(status).toBe(200);
      expect(token).toBeDefined();

      const { result: meResult, status: meStatus } = await fetchAndParse(
        '/users/me',
        token
      );
      expect(meStatus).toBe(200);
      expect(meResult.name).toBe(name);
    });
  });
});
