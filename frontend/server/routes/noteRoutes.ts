import { Router } from 'express';
import { z } from 'zod';
import { isAdmin, requireAuth } from '../middleware/auth.js';
import * as noteService from '../services/noteService.js';
import { ok } from '../utils/responses.js';

const createNoteSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().optional(),
  tags: z.string().optional(),
  category: z.string().optional(),
  pinned: z.boolean().optional(),
  favorite: z.boolean().optional(),
});

const updateNoteSchema = createNoteSchema.extend({
  archived: z.boolean().optional(),
});

export const noteRoutes = Router();

noteRoutes.use(requireAuth);

noteRoutes.get('/', async (req, res, next) => {
  try {
    const data = await noteService.listNotes(req.auth!.userId);
    ok(res, data);
  } catch (err) {
    next(err);
  }
});

noteRoutes.post('/', async (req, res, next) => {
  try {
    const body = createNoteSchema.parse(req.body);
    const data = await noteService.createNote(req.auth!.userId, body);
    ok(res, data, 'Note created', 201);
  } catch (err) {
    next(err);
  }
});

noteRoutes.put('/:id', async (req, res, next) => {
  try {
    const body = updateNoteSchema.parse(req.body);
    const data = await noteService.updateNote(req.auth!.userId, Number(req.params.id), body);
    ok(res, data, 'Note updated');
  } catch (err) {
    next(err);
  }
});

noteRoutes.delete('/:id', async (req, res, next) => {
  try {
    await noteService.deleteNote(req.auth!.userId, Number(req.params.id), isAdmin(req));
    ok(res, null, 'Note deleted');
  } catch (err) {
    next(err);
  }
});
