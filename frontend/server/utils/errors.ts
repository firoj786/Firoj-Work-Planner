export type ErrorCode =
  | 'RESOURCE_NOT_FOUND'
  | 'INVALID_OPERATION'
  | 'DUPLICATE_RESOURCE'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'ACCESS_DENIED'
  | 'UNAUTHORIZED'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly errorCode: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFound(message: string): AppError {
  return new AppError(404, 'RESOURCE_NOT_FOUND', message);
}

export function unauthorized(message: string): AppError {
  return new AppError(401, 'UNAUTHORIZED', message);
}

export function forbidden(message: string): AppError {
  return new AppError(403, 'ACCESS_DENIED', message);
}

export function conflict(message: string): AppError {
  return new AppError(409, 'DUPLICATE_RESOURCE', message);
}

export function badRequest(message: string): AppError {
  return new AppError(400, 'INVALID_OPERATION', message);
}
