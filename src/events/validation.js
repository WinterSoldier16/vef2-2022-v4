import { body } from 'express-validator';
import xss from 'xss';
import { isPatchingAllowAsOptional } from '../lib/validators.js';

// Endurnýtum mjög líka validation

export function registrationValidationMiddleware(textField) {
  return [
    body('name')
      .if(isPatchingAllowAsOptional)
      .trim()
      .isLength({ min: 1, max: 64 })
      .withMessage('name is required, max 64 characters'),
    body(textField)
      .if(isPatchingAllowAsOptional)
      .isLength({ max: 400 })
      .withMessage(
        `${
          textField === 'comment' ? 'comment' : 'description'
        } max 400 characters`
      ),
  ];
}

// Viljum keyra sér og með validation, ver gegn „self XSS“
export function xssSanitizationMiddleware(textField) {
  return [
    body('name').customSanitizer((v) => xss(v)),
    body(textField).customSanitizer((v) => xss(v)),
  ];
}

export function sanitizationMiddleware(textField) {
  return [body('name').trim().escape(), body(textField).trim().escape()];
}
