# Make My Car Backend (Express)

Fast TypeScript backend scaffold using Express.

## Features

- Express + TypeScript
- Security middleware (`helmet`, `cors`, rate limiter)
- Compression + request logging
- Health endpoint for uptime checks
- Centralized error handling
- Vitest + Supertest baseline test

## Project Structure

```text
Backend/
  src/
    app.ts
    server.ts
    config/env.ts
    middleware/error.ts
    routes/
      health.routes.ts
      index.ts
    scripts/smoke.ts
  test/health.test.ts
  .env.example
  package.json
  tsconfig.json
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Start in dev mode:

```bash
npm run dev
```

4. Health check:

```bash
curl http://localhost:5000/api/v1/health
```

## Validation

Run tests:

```bash
npm test
```

Run smoke test:

```bash
npm run smoke
```
