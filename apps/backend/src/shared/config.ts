import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

dotenv.config();

export interface AppConfig {
  port: number;
  host: string;
  nodeEnv: string;
  databaseUrl: string;
  corsOrigin: string;
}

export const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@127.0.0.1:5433/business_card?schema=public';

export const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

export const configFactory = (): AppConfig => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const defaultPort = nodeEnv === 'production' ? '3000' : '3001';

  const rawPort =
    process.env.PORT ||
    (nodeEnv === 'production'
      ? process.env.BACKEND_PORT
      : process.env.BACKEND_DEV_PORT) ||
    process.env.BACKEND_DEV_PORT ||
    process.env.BACKEND_PORT ||
    defaultPort;

  return {
    port: parseInt(rawPort, 10),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv,
    databaseUrl: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    corsOrigin: process.env.CORS_ORIGIN || '*',
  };
};

export default configFactory;
