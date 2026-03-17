import { createApp } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';

const app = createApp();

async function bootstrap() {
  await pool.query('SELECT 1');
  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
    console.log(`Health: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
