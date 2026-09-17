import 'dotenv/config';

export interface AppConfig {
  port: number;
  host: string;
  nodeEnv: string;
  databaseUrl: string;
  corsOrigin: string;
}

const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@127.0.0.1:5433/business_card?schema=public';

export const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

export const configFactory = (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || '*',
});

export default configFactory;
