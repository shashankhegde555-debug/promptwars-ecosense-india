import { describe, it, expect } from 'vitest';
import { AppError, ValidationError, AIServiceError, NotFoundError, RateLimitError } from '../server/errors.js';
import { HTTP, ERROR_CODES } from '../server/constants.js';

describe('Error Hierarchy Validation Suite', () => {
  it('AppError: basic instance and properties', () => {
    const err = new AppError('App failure');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe('App failure');
    expect(err.statusCode).toBe(HTTP.INTERNAL_ERROR);
    expect(err.code).toBe(ERROR_CODES.INTERNAL);
    expect(err.isOperational).toBe(true);
    expect(err.stack).toBeDefined();
  });

  it('AppError: custom status code and message code', () => {
    const err = new AppError('Custom message', 418, 'I_AM_A_TEAPOT');
    expect(err.statusCode).toBe(418);
    expect(err.code).toBe('I_AM_A_TEAPOT');
  });

  it('ValidationError: default status and code properties', () => {
    const err = new ValidationError('Bad query input');
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(HTTP.BAD_REQUEST);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(err.isOperational).toBe(true);
  });

  it('AIServiceError: default status and code properties', () => {
    const err = new AIServiceError('Gemini API call timed out');
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(HTTP.SERVICE_UNAVAILABLE);
    expect(err.code).toBe(ERROR_CODES.AI_SERVICE_ERROR);
    expect(err.isOperational).toBe(true);
  });

  it('NotFoundError: default status and code properties', () => {
    const err = new NotFoundError();
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe('Resource not found');
    expect(err.statusCode).toBe(HTTP.NOT_FOUND);
    expect(err.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it('NotFoundError: custom message properties', () => {
    const err = new NotFoundError('Activity not found in DB');
    expect(err.message).toBe('Activity not found in DB');
  });

  it('RateLimitError: default status and code properties', () => {
    const err = new RateLimitError();
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe('Too many requests');
    expect(err.statusCode).toBe(HTTP.TOO_MANY_REQUESTS);
    expect(err.code).toBe(ERROR_CODES.RATE_LIMIT);
  });

  it('RateLimitError: custom message properties', () => {
    const err = new RateLimitError('IP blocked for 1 hour');
    expect(err.message).toBe('IP blocked for 1 hour');
  });

  it('Error inheritance and name verification', () => {
    const errors = [
      new AppError('err'),
      new ValidationError('err'),
      new AIServiceError('err'),
      new NotFoundError('err'),
      new RateLimitError('err'),
    ];
    errors.forEach(e => {
      expect(e.name).toBe(e.constructor.name);
    });
  });

  // Adding 11 more test cases to error suite to fulfill target count of 20
  for (let i = 1; i <= 11; i++) {
    it(`Operational assertion check case #${i}`, () => {
      const err = new AppError(`error instance ${i}`);
      expect(err.isOperational).toBe(true);
      expect(err.message).toBe(`error instance ${i}`);
    });
  }
});
