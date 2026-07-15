import { Router } from 'express';
import { ok } from '../utils/responses.js';

export const healthRoutes = Router();

healthRoutes.get('/health', (_req, res) => {
  ok(res, { status: 'UP' });
});

healthRoutes.get('/info', (_req, res) => {
  ok(res, { app: 'workpilot-api', runtime: 'node' });
});
