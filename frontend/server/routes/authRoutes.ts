import { Router } from 'express';
import { z } from 'zod';
import * as authService from '../services/authService.js';
import { ok } from '../utils/responses.js';

const registerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRoutes = Router();

authRoutes.post('/register', async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const data = await authService.register(body.name, body.email, body.password);
    ok(res, data, 'Registered successfully');
  } catch (err) {
    next(err);
  }
});

authRoutes.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const data = await authService.login(body.email, body.password);
    ok(res, data, 'Login successful');
  } catch (err) {
    next(err);
  }
});
