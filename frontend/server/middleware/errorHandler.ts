import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { fail } from '../utils/responses.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): Response {
  if (err instanceof AppError) {
    return fail(res, err.status, err.errorCode, err.message);
  }
  if (err instanceof ZodError) {
    const details = err.errors.map((issue) => ({
      field: issue.path.join('.') || 'body',
      message: issue.message,
    }));
    return fail(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
  }
  console.error(err);
  return fail(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred');
}
