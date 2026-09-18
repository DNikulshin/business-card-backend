import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { configFactory, getDatabaseUrl } from './config.js';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getDatabaseUrl', () => {
    it('returns DATABASE_URL when environment variable is present', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
      expect(getDatabaseUrl()).toBe('postgresql://user:pass@localhost:5432/db');
    });

    it('throws descriptive error when DATABASE_URL is missing', () => {
      delete process.env.DATABASE_URL;
      expect(() => getDatabaseUrl()).toThrowError(/DATABASE_URL is not set/);
    });
  });

  describe('configFactory', () => {
    it('returns default development configuration when environment variables are omitted', () => {
      delete process.env.PORT;
      delete process.env.BACKEND_DEV_PORT;
      delete process.env.BACKEND_PORT;
      delete process.env.HOST;
      delete process.env.NODE_ENV;
      delete process.env.CORS_ORIGIN;
      process.env.DATABASE_URL =
        'postgresql://postgres:postgres@127.0.0.1:5433/business_card?schema=public';

      const config = configFactory();

      expect(config.port).toBe(3001);
      expect(config.host).toBe('0.0.0.0');
      expect(config.nodeEnv).toBe('development');
      expect(config.databaseUrl).toBe(
        'postgresql://postgres:postgres@127.0.0.1:5433/business_card?schema=public',
      );
      expect(config.corsOrigin).toBe('*');
    });

    it('defaults to port 3000 in production when ports are omitted', () => {
      delete process.env.PORT;
      delete process.env.BACKEND_DEV_PORT;
      delete process.env.BACKEND_PORT;
      process.env.NODE_ENV = 'production';
      process.env.DATABASE_URL =
        'postgresql://postgres:postgres@127.0.0.1:5433/business_card?schema=public';

      const config = configFactory();

      expect(config.port).toBe(3000);
      expect(config.nodeEnv).toBe('production');
    });

    it('respects BACKEND_DEV_PORT in development environment', () => {
      delete process.env.PORT;
      process.env.NODE_ENV = 'development';
      process.env.BACKEND_DEV_PORT = '3005';
      process.env.DATABASE_URL =
        'postgresql://postgres:postgres@127.0.0.1:5433/business_card?schema=public';

      const config = configFactory();

      expect(config.port).toBe(3005);
    });

    it('reads custom environment variables', () => {
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

    it('respects BACKEND_PORT when PORT and BACKEND_DEV_PORT are omitted', () => {
      delete process.env.PORT;
      delete process.env.BACKEND_DEV_PORT;
      process.env.BACKEND_PORT = '3008';
      process.env.DATABASE_URL =
        'postgresql://postgres:postgres@127.0.0.1:5433/business_card?schema=public';

      const config = configFactory();
      expect(config.port).toBe(3008);
    });

    it('propagates error when DATABASE_URL is not set', () => {
      delete process.env.DATABASE_URL;
      expect(() => configFactory()).toThrowError(/DATABASE_URL is not set/);
    });
  });
});
