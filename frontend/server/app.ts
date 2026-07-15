import cors from 'cors';
import express from 'express';
import { assertDatabaseConfigured, config } from './config.js';
import { runMigrations } from './db/migrate.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/authRoutes.js';
import { dashboardRoutes } from './routes/dashboardRoutes.js';
import { healthRoutes } from './routes/healthRoutes.js';
import { knowledgeRoutes } from './routes/knowledgeRoutes.js';
import { noteRoutes } from './routes/noteRoutes.js';
import { taskRoutes } from './routes/taskRoutes.js';
import { userRoutes } from './routes/dashboardRoutes.js';

let appPromise: Promise<express.Express> | null = null;

function matchesOrigin(origin: string, pattern: string): boolean {
  if (pattern.includes('*')) {
    const regex = new RegExp(`^${pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`);
    return regex.test(origin);
  }
  return origin === pattern;
}

export async function createApp(): Promise<express.Express> {
  if (appPromise) {
    return appPromise;
  }

  appPromise = (async () => {
    assertDatabaseConfigured();
    await runMigrations();

    const app = express();
    app.use(cors({
      origin(origin, callback) {
        if (!origin || config.corsOrigins.some((allowed) => matchesOrigin(origin, allowed))) {
          callback(null, true);
          return;
        }
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }));
    app.use(express.json({ limit: '1mb' }));

    app.use('/actuator', healthRoutes);
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/dashboard', dashboardRoutes);
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/tasks', taskRoutes);
    app.use('/api/v1/notes', noteRoutes);
    app.use('/api/v1/knowledge', knowledgeRoutes);

    app.use(errorHandler);
    return app;
  })();

  return appPromise;
}
