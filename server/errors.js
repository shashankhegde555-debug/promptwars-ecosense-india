import { HTTP, ERROR_CODES } from './constants.js';

/**
 * Base application error class.
 * All custom errors extend this.
 */
export class AppError extends Error {
  constructor(message, statusCode = HTTP.INTERNAL_ERROR, code = ERROR_CODES.INTERNAL) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation errors (400) — bad user input, schema failures.
 */
export class ValidationError extends AppError {
  constructor(message) {
    super(message, HTTP.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
  }
}

/**
 * AI service errors (503) — Gemini failures, timeouts.
 */
export class AIServiceError extends AppError {
  constructor(message) {
    super(message, HTTP.SERVICE_UNAVAILABLE, ERROR_CODES.AI_SERVICE_ERROR);
  }
}

/**
 * Not found errors (404).
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HTTP.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
}

/**
 * Rate limit errors (429).
 */
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, HTTP.TOO_MANY_REQUESTS, ERROR_CODES.RATE_LIMIT);
  }
}
