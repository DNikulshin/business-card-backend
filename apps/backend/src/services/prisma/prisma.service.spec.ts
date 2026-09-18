import { describe, it, expect, vi } from 'vitest';
import { PrismaService } from './prisma.service.js';

vi.mock('@prisma/adapter-pg', () => {
  return {
    PrismaPg: vi.fn().mockImplementation(function () {
      return {
        provider: 'postgres',
        adapterName: '@prisma/adapter-pg',
      };
    }),
  };
});

vi.mock('pg', () => {
  return {
    Pool: vi.fn().mockImplementation(function () {
      return {
        end: vi.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

describe('PrismaService', () => {
  it('instantiates correctly', () => {
    const service = new PrismaService();
    expect(service).toBeDefined();
  });

  it('connects to the database on module init', async () => {
    const service = new PrismaService();
    const connectSpy = vi
      .spyOn(service, '$connect')
      .mockResolvedValue(undefined);

    await service.onModuleInit();

    expect(connectSpy).toHaveBeenCalledTimes(1);
  });

  it('disconnects from the database and closes pool on module destroy', async () => {
    const service = new PrismaService();
    const disconnectSpy = vi
      .spyOn(service, '$disconnect')
      .mockResolvedValue(undefined);

    await service.onModuleDestroy();

    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });
});
