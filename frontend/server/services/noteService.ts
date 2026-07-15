import { query } from '../db/pool.js';
import { forbidden, notFound } from '../utils/errors.js';
import { mapNote, type NoteRow } from '../utils/mappers.js';

export async function listNotes(userId: number) {
  const result = await query<NoteRow>(
    `SELECT pk_id, title, content, tags, category, pinned, favorite, archived, created_at, updated_at
     FROM wp_notes
     WHERE fk_user = $1 AND archived = FALSE
     ORDER BY pinned DESC, updated_at DESC`,
    [userId],
  );
  return result.rows.map(mapNote);
}

export async function createNote(userId: number, payload: {
  title: string;
  content?: string;
  tags?: string;
  category?: string;
  pinned?: boolean;
  favorite?: boolean;
}) {
  const result = await query<NoteRow>(
    `INSERT INTO wp_notes (fk_user, title, content, tags, category, pinned, favorite, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     RETURNING pk_id, title, content, tags, category, pinned, favorite, archived, created_at, updated_at`,
    [
      userId,
      payload.title,
      payload.content ?? null,
      payload.tags ?? null,
      payload.category ?? null,
      payload.pinned ?? false,
      payload.favorite ?? false,
    ],
  );
  return mapNote(result.rows[0]);
}

export async function updateNote(userId: number, noteId: number, payload: {
  title: string;
  content?: string;
  tags?: string;
  category?: string;
  pinned?: boolean;
  favorite?: boolean;
  archived?: boolean;
}) {
  const result = await query<NoteRow>(
    `UPDATE wp_notes
     SET title = $3, content = $4, tags = $5, category = $6, pinned = $7, favorite = $8,
         archived = $9, updated_at = NOW()
     WHERE pk_id = $1 AND fk_user = $2
     RETURNING pk_id, title, content, tags, category, pinned, favorite, archived, created_at, updated_at`,
    [
      noteId,
      userId,
      payload.title,
      payload.content ?? null,
      payload.tags ?? null,
      payload.category ?? null,
      payload.pinned ?? false,
      payload.favorite ?? false,
      payload.archived ?? false,
    ],
  );
  if (!result.rowCount) {
    throw notFound('Note not found');
  }
  return mapNote(result.rows[0]);
}

export async function deleteNote(userId: number, noteId: number, admin: boolean) {
  const existing = await query<{ fk_user: number }>(
    'SELECT fk_user FROM wp_notes WHERE pk_id = $1',
    [noteId],
  );
  const row = existing.rows[0];
  if (!row) {
    throw notFound('Note not found');
  }
  if (!admin && row.fk_user !== userId) {
    throw forbidden('Not allowed to delete this note');
  }
  await query('DELETE FROM wp_notes WHERE pk_id = $1', [noteId]);
}
