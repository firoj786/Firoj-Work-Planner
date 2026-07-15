import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { config } from '../config.js';
import { query } from '../db/pool.js';
import { mapNote, mapTask, type NoteRow, type TaskRow } from '../utils/mappers.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getDashboard(userId: number) {
  const today = dayjs().tz(config.appTimezone).format('YYYY-MM-DD');

  const [todayCount, pendingCount, completedCount, notesCount, knowledgeCount] = await Promise.all([
    query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM wp_tasks WHERE fk_user = $1 AND due_date = $2',
      [userId, today],
    ),
    query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM wp_tasks
       WHERE fk_user = $1 AND status IN ('TODO', 'IN_PROGRESS', 'BLOCKED')`,
      [userId],
    ),
    query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM wp_tasks WHERE fk_user = $1 AND status = 'COMPLETED'`,
      [userId],
    ),
    query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM wp_notes WHERE fk_user = $1 AND archived = FALSE',
      [userId],
    ),
    query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM wp_knowledge WHERE fk_user = $1',
      [userId],
    ),
  ]);

  const tasksResult = await query<TaskRow>(
    `SELECT pk_id, title, description, priority, status, due_date, reminder_at, labels, color, created_at, updated_at
     FROM wp_tasks
     WHERE fk_user = $1
     ORDER BY due_date ASC NULLS LAST, created_at DESC`,
    [userId],
  );
  const allTasks = tasksResult.rows.map(mapTask);
  const upcomingTasks = allTasks.filter((task) => task.status !== 'COMPLETED').slice(0, 5);

  const notesResult = await query<NoteRow>(
    `SELECT pk_id, title, content, tags, category, pinned, favorite, archived, created_at, updated_at
     FROM wp_notes
     WHERE fk_user = $1 AND archived = FALSE
     ORDER BY updated_at DESC
     LIMIT 5`,
    [userId],
  );
  const recentNotes = notesResult.rows.map(mapNote);

  const activity = [
    ...allTasks.slice(0, 3).map((task) => ({
      type: 'task',
      title: task.title,
      timestamp: task.updatedAt,
    })),
    ...recentNotes.slice(0, 3).map((note) => ({
      type: 'note',
      title: note.title,
      timestamp: note.updatedAt,
    })),
  ]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 6);

  return {
    todaysTasks: Number(todayCount.rows[0].count),
    pendingTasks: Number(pendingCount.rows[0].count),
    completedTasks: Number(completedCount.rows[0].count),
    notesCount: Number(notesCount.rows[0].count),
    knowledgeCount: Number(knowledgeCount.rows[0].count),
    upcomingTasks,
    recentNotes,
    recentActivity: activity,
  };
}
