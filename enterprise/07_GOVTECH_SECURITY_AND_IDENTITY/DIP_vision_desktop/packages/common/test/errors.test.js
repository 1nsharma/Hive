import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { AppError, ErrorCode, isAppError } from '../src/errors/index.js';

describe('Domain Errors Taxonomy', () => {
  test('AppError creates instance with correct HTTP status mapping', () => {
    const errUnauth = new AppError(ErrorCode.UNAUTHORIZED, 'Invalid credentials');
    assert.equal(errUnauth.code, 'UNAUTHORIZED');
    assert.equal(errUnauth.httpStatus, 401);
    assert.equal(errUnauth.message, 'Invalid credentials');
    assert.equal(isAppError(errUnauth), true);

    const errForbidden = new AppError(ErrorCode.FORBIDDEN, 'Access denied');
    assert.equal(errForbidden.httpStatus, 403);

    const errTenant = new AppError(ErrorCode.TENANT_VIOLATION, 'Cross tenant access blocked');
    assert.equal(errTenant.httpStatus, 403);

    const errNotFound = new AppError(ErrorCode.NOT_FOUND, 'Resource not found');
    assert.equal(errNotFound.httpStatus, 404);

    const errValidation = new AppError(ErrorCode.VALIDATION_FAILED, 'Invalid input', { field: 'email' });
    assert.equal(errValidation.httpStatus, 400);
    assert.deepEqual(errValidation.details, { field: 'email' });
  });

  test('toJSON() serializes standard response envelope with correlation_id', () => {
    const err = new AppError(ErrorCode.VALIDATION_FAILED, 'Email format invalid', { field: 'email' });
    const json = err.toJSON('trace-corr-999');

    assert.deepEqual(json, {
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Email format invalid',
        details: { field: 'email' },
        correlation_id: 'trace-corr-999',
      }
    });
  });
});
