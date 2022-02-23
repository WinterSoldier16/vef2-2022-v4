import { validationResult } from 'express-validator';

/**
 * Checks to see if there are validation errors or returns next middlware if not.
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @param {function} next Next middleware
 * @returns Next middleware or validation errors.
 */
export function validationCheck(req, res, next) {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const notFoundError = validation.errors.find(
      (error) => error.msg === 'not found'
    );
    const serverError = validation.errors.find(
      (error) => error.msg === 'server error'
    );

    // We loose the actual error object of LoginError, match with error message
    const loginError = validation.errors.find(
      (error) => error.msg === 'username or password incorrect'
    );

    let status = 400;

    if (serverError) {
      status = 500;
    } else if (notFoundError) {
      status = 404;
    } else if (loginError) {
      status = 401;
    }

    return res.status(status).json({ errors: validation.errors });
  }

  return next();
}
