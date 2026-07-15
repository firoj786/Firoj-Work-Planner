import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config, resolveJwtSecret } from '../config.js';
import { unauthorized } from '../utils/errors.js';

export interface AuthUser {
  userId: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

interface JwtPayload {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export function signToken(userId: number, email: string, role: 'USER' | 'ADMIN'): string {
  return jwt.sign({ email, role }, resolveJwtSecret(), {
    subject: String(userId),
    expiresIn: Math.floor(config.jwtExpirationMs / 1000),
  });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(unauthorized('Authentication required'));
    return;
  }
  const token = header.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, resolveJwtSecret()) as JwtPayload;
    req.auth = {
      userId: Number(payload.sub),
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    next(unauthorized('Invalid or expired token'));
  }
}

export function isAdmin(req: Request): boolean {
  return req.auth?.role === 'ADMIN';
}
