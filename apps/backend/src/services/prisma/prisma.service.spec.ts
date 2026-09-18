import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

describe('PrismaService', () => {
  let service: PrismaService;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    service = new PrismaService();
    errorSpy = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    logSpy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    logSpy.mockRestore();
  });

  describe('onModuleInit', () => {
    it('successfully connects to database', async () => {
      const connectSpy = vi.spyOn(service, '$connect').mockResolvedValue();

      await expect(service.onModuleInit()).resolves.toBeUndefined();
      expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('re-throws error when database connection fails', async () => {
      const error = new Error('Database connection failed');
      vi.spyOn(service, '$connect').mockRejectedValue(error);

      await expect(service.onModuleInit()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('onModuleDestroy', () => {
    it('disconnects prisma client and ends pool connection', async () => {
      const disconnectSpy = vi
        .spyOn(service, '$disconnect')
        .mockResolvedValue();
      const poolEndSpy = vi
        .spyOn(
          (service as unknown as { pool: { end: () => Promise<void> } }).pool,
          'end',
        )
        .mockResolvedValue();

      await expect(service.onModuleDestroy()).resolves.toBeUndefined();
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
      expect(poolEndSpy).toHaveBeenCalledTimes(1);
    });

    it('handles teardown errors gracefully without throwing', async () => {
      vi.spyOn(service, '$disconnect').mockRejectedValue(
        new Error('Teardown error'),
      );

      await expect(service.onModuleDestroy()).resolves.toBeUndefined();
    });
  });

  it('instantiates with custom DATABASE_URL from process.env', () => {
    const prev = process.env.DATABASE_URL;
    process.env.DATABASE_URL =
      'postgresql://custom:custom@localhost:5432/custom';
    const instance = new PrismaService();
    expect(instance).toBeDefined();
    process.env.DATABASE_URL = prev;
  });
});
