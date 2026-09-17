import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env'),
});

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().optional(),
  DATABASE_URL: z.string().url().optional(),
  DATABASE_DEV_URL: z
    .string()
    .url()
    .default(
      'postgresql://postgres:postgres@localhost:5433/business_card?schema=public',
    ),
  DATABASE_PROD_URL: z
    .string()
    .url()
    .default(
      'postgresql://postgres:postgres@postgres:5432/business_card?schema=public',
    ),
});

const parsedEnv = environmentSchema.parse(process.env);
const isProd = parsedEnv.NODE_ENV === 'production';

export const configFactory = () => {
  const nodeEnv = parsedEnv.NODE_ENV;
  // Если PORT передан через Docker (3000), берем его, иначе дефолты
  const port = parsedEnv.PORT || (isProd ? 3000 : 3001);

  return {
    nodeEnv,
    isProd,
    port,
    host:
      isProd || process.env.DATABASE_URL?.includes('postgres:5432')
        ? '0.0.0.0'
        : '127.0.0.1',

    databaseUrl:
      parsedEnv.DATABASE_URL ||
      (isProd ? parsedEnv.DATABASE_PROD_URL : parsedEnv.DATABASE_DEV_URL),
  };
};

export type AppConfig = ReturnType<typeof configFactory>;

export const { DATABASE_URL, PORT, NODE_ENV, IS_PROD } = {
  DATABASE_URL: configFactory().databaseUrl,
  PORT: configFactory().port,
  NODE_ENV: configFactory().nodeEnv,
  IS_PROD: configFactory().isProd,
};
