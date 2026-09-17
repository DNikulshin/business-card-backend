import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { configFactory } from './config.js';

describe('configFactory', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns default configuration when environment variables are omitted', () => {
    delete process.env.PORT;
    delete process.env.BACKEND_DEV_PORT;
    delete process.env.BACKEND_PORT;
    delete process.env.HOST;
    delete process.env.NODE_ENV;
    delete process.env.DATABASE_URL;
    delete process.env.CORS_ORIGIN;

    const config = configFactory();

    expect(config.port).toBe(3000);
    expect(config.host).toBe('0.0.0.0');
    expect(config.nodeEnv).toBe('development');
    expect(config.databaseUrl).toContain('127.0.0.1:5433');
    expect(config.corsOrigin).toBe('*');
  });

  it('respects BACKEND_DEV_PORT when PORT is not provided', () => {
    delete process.env.PORT;
    process.env.BACKEND_DEV_PORT = '3001';

    const config = configFactory();

    expect(config.port).toBe(3001);
  });

  it('populates configuration correctly when custom environment variables are provided', () => {
    process.env.PORT = '4000';
    process.env.HOST = '127.0.0.1';
    process.env.NODE_ENV = 'production';
    process.env.DATABASE_URL = 'postgresql://custom:custom@localhost:5432/db';
    process.env.CORS_ORIGIN = 'https://example.com';

    const config = configFactory();

    expect(config.port).toBe(4000);
    expect(config.host).toBe('127.0.0.1');
    expect(config.nodeEnv).toBe('production');
    expect(config.databaseUrl).toBe(
      'postgresql://custom:custom@localhost:5432/db',
    );
    expect(config.corsOrigin).toBe('https://example.com');
  });
});
