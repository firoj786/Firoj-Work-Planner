export const config = {
  port: Number(process.env.PORT ?? 3001),
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET
    ?? 'workpilot-dev-secret-key-change-in-production-min-256-bits-long!!',
  jwtExpirationMs: Number(process.env.JWT_EXPIRATION_MS ?? 86_400_000),
  appTimezone: process.env.APP_TIMEZONE ?? 'Asia/Kolkata',
  corsOrigins: (process.env.CORS_ORIGINS
    ?? 'http://localhost:5173,http://127.0.0.1:5173,https://*.netlify.app')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export function assertDatabaseConfigured(): void {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is not configured. Add your Supabase PostgreSQL connection string.');
  }
}

export function resolveJwtSecret(): string {
  const secret = config.jwtSecret;
  if (Buffer.byteLength(secret, 'utf8') >= 32) {
    return secret;
  }
  return Buffer.from(secret, 'utf8').toString('base64');
}
