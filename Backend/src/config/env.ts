import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  SUPABASE_DB_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/postgres'),
  JWT_SECRET: z.string().min(16).default('dev-super-secret-12345'),
  JWT_EXPIRES_IN: z.string().default('1d'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Erro