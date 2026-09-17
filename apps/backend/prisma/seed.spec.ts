import { beforeEach, describe, expect, it, vi } from 'vitest';
import { seedProfile } from './seed.js';
import { PrismaClient } from '#prisma/client.js';

describe('seedProfile', () => {
  let mockTx: {
    profile: {
      deleteMany: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
    };
  };
  let prismaMock: PrismaClient;

  beforeEach(() => {
    mockTx = {
      profile: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        create: vi.fn(),
      },
    };

    prismaMock = {
      $transaction: vi.fn(async (cb: (tx: typeof mockTx) => Promise<unknown>) =>
        cb(mockTx),
      ),
    } as unknown as PrismaClient;
  });

  it('atomically synchronizes profile data in database', async () => {
    const created = { id: 1, name: 'Никульшин Дмитрий Юрьевич' };
    mockTx.profile.create.mockResolvedValue(created);

    const result = await seedProfile(prismaMock);

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(mockTx.profile.deleteMany).toHaveBeenCalledTimes(1);
    expect(mockTx.profile.create).toHaveBeenCalledTimes(1);
    expect(result).toBe(created);
  });

  it('populates non-empty skills, experiences, and projects', async () => {
    mockTx.profile.create.mockResolvedValue({ id: 1, name: 'x' });

    await seedProfile(prismaMock);

    const callArg = mockTx.profile.create.mock.calls[0][0];
    expect(callArg.data.skills.create.length).toBeGreaterThan(0);
    expect(callArg.data.experiences.create.length).toBeGreaterThan(0);
    expect(callArg.data.projects.create.length).toBeGreaterThan(0);
  });
});
