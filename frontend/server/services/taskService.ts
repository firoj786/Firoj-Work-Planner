import { query } from '../db/pool.js';
import { forbidden, notFound } from '../utils/errors.js';
import { mapTask, type TaskRow } from '../utils/mappers.js';

export async function listTasks(userId: number) {
  const result = await query<TaskRow>(
    `SELECT pk_id, title, description, priority, status, due_date, reminder_at, labels, color, created_at, updated_at
     FROM wp_tasks
     WHERE fk_user = $1
     ORDER BY due_date ASC NULLS LAST, created_at DESC`,
    [userId],
  );
  return result.rows.map(mapTask);
}

export async function createTask(userId: number, payload: {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  reminderAt?: string;
  labels?: string;
  color?: string;
}) {
  const result = await query<TaskRow>(
    `INSERT INTO wp_tasks (fk_user, title, description, priority, status, due_date, reminder_at, labels, color, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
     RETURNING pk_id, title, description, priority, status, due_date, reminder_at, labels, color, created_at, updated_at`,
    [
      userId,
      payload.title,
      payload.description ?? null,
      payload.priority ?? 'MEDIUM',
      payload.status ?? 'TODO',
      payload.dueDate ?? null,
      payload.reminderAt ?? null,
      payload.labels ?? null,
      payload.color ?? null,
    ],
  );
  return mapTask(result.rows[0]);
}

export async function updateTask(userId: number, taskId: number, payload: {
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  reminderAt?: string;
  labels?: string;
  color?: string;
}) {
  const result = await query<TaskRow>(
    `UPDATE wp_tasks
     SET title = $3, description = $4, priority = $5, status = $6, due_date = $7,
         reminder_at = $8, labels = $9, color = $10, updated_at = NOW()
     WHERE pk_id = $1 AND fk_user = $2
     RETURNING pk_id, title, description, priority, status, due_date, reminder_at, labels, color, created_at, updated_at`,
    [
      taskId,
      userId,
      payload.title,
      payload.description ?? null,
      payload.priority,
      payload.status,
      payload.dueDate ?? null,
      payload.reminderAt ?? null,
      payload.labels ?? null,
      payload.color ?? null,
    ],
  );
  if (!result.rowCount) {
    throw notFound('Task not found');
  }
  return mapTask(result.rows[0]);
}

export async function deleteTask(userId: number, taskId: number, admin: boolean) {
  const existing = await query<{ fk_user: number }>(
    'SELECT fk_user FROM wp_tasks WHERE pk_id = $1',
    [taskId],
  );
  const row = existing.rows[0];
  if (!row) {
    throw notFound('Task not found');
  }
  if (!admin && row.fk_user !== userId) {
    throw forbidden('Not allowed to delete this task');
  }
  await query('DELETE FROM wp_tasks WHERE pk_id = $1', [taskId]);
}
