import { Router } from 'express';
import { z } from 'zod';
import { isAdmin, requireAuth } from '../middleware/auth.js';
import * as knowledgeService from '../services/knowledgeService.js';
import { ok } from '../utils/responses.js';

const knowledgeSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
});

export const knowledgeRoutes = Router();

knowledgeRoutes.use(requireAuth);

knowledgeRoutes.get('/', async (req, res, next) => {
  try {
    const data = await knowledgeService.listKnowledge(req.auth!.userId);
    ok(res, data);
  } catch (err) {
    next(err);
  }
});

knowledgeRoutes.post('/', async (req, res, next) => {
  try {
    const body = knowledgeSchema.parse(req.body);
    const data = await knowledgeService.createKnowledge(req.auth!.userId, body);
    ok(res, data, 'Article created', 201);
  } catch (err) {
    next(err);
  }
});

knowledgeRoutes.put('/:id', async (req, res, next) => {
  try {
    const body = knowledgeSchema.parse(req.body);
    const data = await knowledgeService.updateKnowledge(req.auth!.userId, Number(req.params.id), body);
    ok(res, data, 'Article updated');
  } catch (err) {
    next(err);
  }
});

knowledgeRoutes.delete('/:id', async (req, res, next) => {
  try {
    await knowledgeService.deleteKnowledge(req.auth!.userId, Number(req.params.id), isAdmin(req));
    ok(res, null, 'Article deleted');
  } catch (err) {
    next(err);
  }
});
