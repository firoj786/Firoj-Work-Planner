import { Router } from 'express';
import { z } from 'zod';
import { isAdmin, requireAuth } from '../middleware/auth.js';
import * as taskService from '../services/taskService.js';
import { ok } from '../utils/responses.js';

const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
const statusEnum = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']);

const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  dueDate: z.string().optional(),
  reminderAt: z.string().optional(),
  labels: z.string().optional(),
  color: z.string().optional(),
});

const updateTaskSchema = createTaskSchema.extend({
  priority: priorityEnum,
  status: statusEnum,
});

export const taskRoutes = Router();

taskRoutes.use(requireAuth);

taskRoutes.get('/', async (req, res, next) => {
  try {
    const data = await taskService.listTasks(req.auth!.userId);
    ok(res, data);
  } catch (err) {
    next(err);
  }
});

taskRoutes.post('/', async (req, res, next) => {
  try {
    const body = createTaskSchema.parse(req.body);
    const data = await taskService.createTask(req.auth!.userId, body);
    ok(res, data, 'Task created', 201);
  } catch (err) {
    next(err);
  }
});

taskRoutes.put('/:id', async (req, res, next) => {
  try {
    const body = updateTaskSchema.parse(req.body);
    const data = await taskService.updateTask(req.auth!.userId, Number(req.params.id), body);
    ok(res, data, 'Task updated');
  } catch (err) {
    next(err);
  }
});

taskRoutes.delete('/:id', async (req, res, next) => {
  try {
    await taskService.deleteTask(req.auth!.userId, Number(req.params.id), isAdmin(req));
    ok(res, null, 'Task deleted');
  } catch (err) {
    next(err);
  }
});
