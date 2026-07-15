import { query } from './pool.js';
import { SCHEMA_SQL } from './schemaSql.js';

let migrated = false;

/**
 * Applies idempotent schema SQL on first use (safe for Netlify cold starts).
 */
export async function runMigrations(): Promise<void> {
  if (migrated) {
    return;
  }
  await query(SCHEMA_SQL);
  migrated = true;
}
