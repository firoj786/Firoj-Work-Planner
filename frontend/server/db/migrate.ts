import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from './pool.js';

let migrated = false;

/**
 * Applies idempotent schema SQL on first use (safe for Netlify cold starts).
 */
export async function runMigrations(): Promise<void> {
  if (migrated) {
    return;
  }
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const schema = readFileSync(join(currentDir, 'schema.sql'), 'utf8');
  await query(schema);
  migrated = true;
}
