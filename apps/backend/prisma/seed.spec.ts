import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { seedProfile } from './seed.js';
import { PrismaClient } from '#prisma/client.js';

describe('seedProfile', () => {
  let mockPrisma: {
    profile: {
      findFirst: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
    };
  };
  let prismaMock: PrismaClient;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockPrisma = {
      profile: { findFirst: vi.fn(), create: vi.fn() },
    };
    prismaMock = mockPrisma as unknown as PrismaClient;
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('does not create profile if one already exists', async () => {
    mockPrisma.profile.findFirst.mockResolvedValue({ id: 1, name: 'Existing' });

    const result = await seedProfile(prismaMock);

    expect(mockPrisma.profile.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.profile.create).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('creates profile when database is empty', async () => {
    mockPrisma.profile.findFirst.mockResolvedValue(null);
    const created = { id: 1, name: 'Никульшин Дмитрий Юрьевич' };
    mockPrisma.profile.create.mockResolvedValue(created);

    const result = await seedProfile(prismaMock);

    expect(mockPrisma.profile.create).toHaveBeenCalledTimes(1);
    expect(result).toBe(created);
  });

  it('passes non-empty skills, experiences, and projects to create', async () => {
    mockPrisma.profile.findFirst.mockResolvedValue(null);
    mockPrisma.profile.create.mockResolvedValue({ id: 1, name: 'x' });

    await seedProfile(prismaMock);

    const callArg = mockPrisma.profile.create.mock.calls[0][0];
    expect(callArg.data.skills.create.length).toBeGreaterThan(0);
    expect(callArg.data.experiences.create.length).toBeGreaterThan(0);
    expect(callArg.data.projects.create.length).toBeGreaterThan(0);
  });
});
