import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceUnavailableException } from '@nestjs/common';
import { AppService } from './app.service.js';
import { PrismaService } from '../services/prisma/prisma.service.js';

describe('AppService', () => {
  let service: AppService;
  let mockPrisma: { $queryRaw: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockPrisma = {
      $queryRaw: vi.fn(),
    };
    service = new AppService(mockPrisma as unknown as PrismaService);
  });

  describe('checkHealth', () => {
    it('returns ok status and connected database when query succeeds', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.checkHealth();

      expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        status: 'ok',
        database: 'connected',
      });
      expect(typeof result.timestamp).toBe('string');
      expect(new Date(result.timestamp).getTime()).not.toBeNaN();
    });

    it('throws ServiceUnavailableException when database query fails', async () => {
      const dbError = new Error('Connection refused');
      mockPrisma.$queryRaw.mockRejectedValue(dbError);

      await expect(service.checkHealth()).rejects.toThrow(
        ServiceUnavailableException,
      );

      try {
        await service.checkHealth();
      } catch (error) {
        const err = error as ServiceUnavailableException;
        expect(err.getStatus()).toBe(503);
        expect(err.getResponse()).toMatchObject({
          status: 'error',
          database: 'disconnected',
          message: 'Connection refused',
        });
      }
    });
  });
});
