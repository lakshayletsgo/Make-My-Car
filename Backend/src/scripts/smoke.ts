import { createApp } from '../app.js';

const app = createApp();

const port = 5051;
const server = app.listen(port, async () => {
  try {
    const response = await fetch(`http://localhost:${port}/api/v1/health`);
    const data = await response.json();
    console.log('Smoke test response:', data);
  } catch (error) {
    console.error('Smoke test failed:', error);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
