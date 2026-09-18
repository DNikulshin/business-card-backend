import { beforeEach, describe, expect, it, vi } from 'vitest';
import { seedProfile } from './seed.js';
import { PrismaClient } from '#prisma/client.js';

describe('seedProfile', () => {
  let mockTx: {
    profile: { upsert: ReturnType<typeof vi.fn> };
    skill: {
      deleteMany: ReturnType<typeof vi.fn>;
      createMany: ReturnType<typeof vi.fn>;
    };
    experience: {
      deleteMany: ReturnType<typeof vi.fn>;
      createMany: ReturnType<typeof vi.fn>;
    };
    project: {
      deleteMany: ReturnType<typeof vi.fn>;
      createMany: ReturnType<typeof vi.fn>;
    };
  };
  let prismaMock: PrismaClient;

  beforeEach(() => {
    mockTx = {
      profile: { upsert: vi.fn() },
      skill: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        createMany: vi.fn(),
      },
      experience: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        createMany: vi.fn(),
      },
      project: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        createMany: vi.fn(),
      },
    };

    prismaMock = {
      $transaction: vi.fn(async (cb: (tx: typeof mockTx) => Promise<unknown>) =>
        cb(mockTx),
      ),
    } as unknown as PrismaClient;
  });

  it('atomically upserts profile and synchronizes related entities', async () => {
    const created = { id: 1, name: 'Никульшин Дмитрий Юрьевич' };
    mockTx.profile.upsert.mockResolvedValue(created);

    const result = await seedProfile(prismaMock);

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(mockTx.profile.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
      }),
    );
    expect(mockTx.skill.createMany).toHaveBeenCalledTimes(1);
    expect(mockTx.experience.createMany).toHaveBeenCalledTimes(1);
    expect(mockTx.project.createMany).toHaveBeenCalledTimes(1);
    expect(result).toBe(created);
  });
});
