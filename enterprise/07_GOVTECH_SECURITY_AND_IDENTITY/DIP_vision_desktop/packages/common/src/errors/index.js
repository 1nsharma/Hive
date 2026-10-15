/**
 * Aura v1: Domain Errors Taxonomy
 * Standardized error types with HTTP status code mapping and correlation support.
 */

export const ErrorCode = Object.freeze({
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  TENANT_VIOLATION: 'TENANT_VIOLATION',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
});

const HTTP_STATUS_MAP = Object.freeze({
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.TENANT_VIOLATION]: 403,
  [ErrorCode.VALIDATION_FAILED]: 400,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503,
});

export class AppError extends Error {
  /**
   * @param {string} code - From ErrorCode
   * @param {string} message - Human-readable error message
   * @param {any} [details=null] - Optional structured error details
   */
  constructor(code, message, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.httpStatus = HTTP_STATUS_MAP[code] || 500;
    this.details = details;
  }

  toJSON(correlationId = null) {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        correlation_id: correlationId,
      },
    };
  }
}

export function isAppError(err) {
  return err instanceof AppError;
}
