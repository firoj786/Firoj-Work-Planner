import serverless from 'serverless-http';
import { createApp } from '../../server/app.js';

let handlerInstance: ReturnType<typeof serverless> | null = null;

export const handler = async (
  event: Parameters<ReturnType<typeof serverless>>[0],
  context: { callbackWaitsForEmptyEventLoop: boolean },
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!handlerInstance) {
    const app = await createApp();
    handlerInstance = serverless(app);
  }
  return handlerInstance(event, context);
};
