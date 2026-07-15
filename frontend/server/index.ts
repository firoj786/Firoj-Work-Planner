import { createApp } from './app.js';
import { config } from './config.js';

const app = await createApp();

app.listen(config.port, () => {
  console.log(`WorkPilot API listening on http://localhost:${config.port}`);
});
