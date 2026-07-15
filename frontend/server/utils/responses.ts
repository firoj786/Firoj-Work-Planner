import type { Response } from 'express';

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  errorCode: string;
  message: string;
  details?: { field: string; message: string }[];
}

export function ok<T>(res: Response, data: T, message = 'Success', status = 200): Response {
  const body: ApiResponse<T> = { success: true, message, data };
  return res.status(status).json(body);
}

export function fail(
  res: Response,
  status: number,
  errorCode: string,
  message: string,
  details?: { field: string; message: string }[],
): Response {
  const body: ApiErrorResponse = { success: false, status, errorCode, message, details };
  return res.status(status).json(body);
}
