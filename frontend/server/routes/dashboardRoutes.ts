import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as authService from '../services/authService.js';
import * as dashboardService from '../services/dashboardService.js';
import { ok } from '../utils/responses.js';

export const dashboardRoutes = Router();
export const userRoutes = Router();

dashboardRoutes.get('/', requireAuth, async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboard(req.auth!.userId);
    ok(res, data);
  } catch (err) {
    next(err);
  }
});

userRoutes.get('/me', requireAuth, async (req, res, next) => {
  try {
    const data = await authService.getProfile(req.auth!.userId);
    ok(res, data);
  } catch (err) {
    next(err);
  }
});
