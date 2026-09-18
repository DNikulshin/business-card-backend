export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Please provide a valid PostgreSQL connection string.',
    );
  }
  return url;
}

export interface AppConfig {
  port: number;
  host: string;
  nodeEnv: string;
  databaseUrl: string;
  corsOrigin: string;
}

export const configFactory = (): AppConfig => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const defaultPort = nodeEnv === 'production' ? 3000 : 3001;
  const port = parseInt(
    process.env.PORT ||
      (nodeEnv === 'development' ? process.env.BACKEND_DEV_PORT : '') ||
      process.env.BACKEND_PORT ||
      String(defaultPort),
    10,
  );

  return {
    port,
    host: process.env.HOST || '0.0.0.0',
    nodeEnv,
    databaseUrl: getDatabaseUrl(),
    corsOrigin: process.env.CORS_ORIGIN || '*',
  };
};

export const config = configFactory;
