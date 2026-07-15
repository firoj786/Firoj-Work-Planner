import serverless from 'serverless-http';
import { createApp } from '../../server/app.js';

let handlerInstance: ReturnType<typeof serverless> | null = null;

export const handler = async (
  event: Parameters<ReturnType<typeof serverless>>[0],
  context: { callbackWaitsForEmptyEventLoop: boolean },
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    if (!handlerInstance) {
      const app = await createApp();
      handlerInstance = serverless(app);
    }
    return await handlerInstance(event, context);
  } catch (err) {
    console.error('Netlify API handler failed during startup or request', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        status: 500,
        errorCode: 'INTERNAL_ERROR',
        message: err instanceof Error ? err.message : 'API failed to start',
      }),
    };
  }
};
