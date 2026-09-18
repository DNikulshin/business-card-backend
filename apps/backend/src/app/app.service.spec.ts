import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceUnavailableException } from '@nestjs/common';
import { AppService } from './app.service.js';
import { PrismaService } from '../services/prisma/prisma.service.js';

describe('AppService', () => {
  let appService: AppService;
  let mockPrisma: { $queryRaw: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockPrisma = {
      $queryRaw: vi.fn(),
    };
    appService = new AppService(mockPrisma as unknown as PrismaService);
  });

  it('returns healthy status when database is reachable', async () => {
    mockPrisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const result = await appService.checkHealth();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('connected');
    expect(result.timestamp).toBeDefined();
    expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('throws ServiceUnavailableException when database query fails with Error', async () => {
    mockPrisma.$queryRaw.mockRejectedValue(new Error('Connection timeout'));

    await expect(appService.checkHealth()).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('throws ServiceUnavailableException when database query fails with non-Error object', async () => {
    mockPrisma.$queryRaw.mockRejectedValue('Database socket closed');

    await expect(appService.checkHealth()).rejects.toThrow(
      ServiceUnavailableException,
    );
  });
});
