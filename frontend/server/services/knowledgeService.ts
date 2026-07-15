import { query } from '../db/pool.js';
import { forbidden, notFound } from '../utils/errors.js';
import { mapKnowledge, type KnowledgeRow } from '../utils/mappers.js';

export async function listKnowledge(userId: number) {
  const result = await query<KnowledgeRow>(
    `SELECT pk_id, title, content, category, tags, version, created_at, updated_at
     FROM wp_knowledge
     WHERE fk_user = $1
     ORDER BY updated_at DESC`,
    [userId],
  );
  return result.rows.map(mapKnowledge);
}

export async function createKnowledge(userId: number, payload: {
  title: string;
  content?: string;
  category?: string;
  tags?: string;
}) {
  const result = await query<KnowledgeRow>(
    `INSERT INTO wp_knowledge (fk_user, title, content, category, tags, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING pk_id, title, content, category, tags, version, created_at, updated_at`,
    [userId, payload.title, payload.content ?? null, payload.category ?? null, payload.tags ?? null],
  );
  return mapKnowledge(result.rows[0]);
}

export async function updateKnowledge(userId: number, articleId: number, payload: {
  title: string;
  content?: string;
  category?: string;
  tags?: string;
}) {
  const result = await query<KnowledgeRow>(
    `UPDATE wp_knowledge
     SET title = $3, content = $4, category = $5, tags = $6, version = version + 1, updated_at = NOW()
     WHERE pk_id = $1 AND fk_user = $2
     RETURNING pk_id, title, content, category, tags, version, created_at, updated_at`,
    [articleId, userId, payload.title, payload.content ?? null, payload.category ?? null, payload.tags ?? null],
  );
  if (!result.rowCount) {
    throw notFound('Knowledge article not found');
  }
  return mapKnowledge(result.rows[0]);
}

export async function deleteKnowledge(userId: number, articleId: number, admin: boolean) {
  const existing = await query<{ fk_user: number }>(
    'SELECT fk_user FROM wp_knowledge WHERE pk_id = $1',
    [articleId],
  );
  const row = existing.rows[0];
  if (!row) {
    throw notFound('Knowledge article not found');
  }
  if (!admin && row.fk_user !== userId) {
    throw forbidden('Not allowed to delete this article');
  }
  await query('DELETE FROM wp_knowledge WHERE pk_id = $1', [articleId]);
}
