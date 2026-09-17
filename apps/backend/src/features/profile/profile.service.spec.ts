import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileService } from './profile.service.js';
import { PrismaService } from '../../services/prisma/prisma.service.js';

describe('ProfileService', () => {
  let service: ProfileService;
  let mockPrisma: { profile: { findFirst: ReturnType<typeof vi.fn> } };

  beforeEach(() => {
    mockPrisma = {
      profile: { findFirst: vi.fn() },
    };
    service = new ProfileService(mockPrisma as unknown as PrismaService);
  });

  it('returns profile with skills, experience, and projects', async () => {
    const mockDbProfile = {
      id: 1,
      name: 'Dmitry Nikulshin',
      description: 'Fullstack developer',
      github: 'https://github.com/DNikulshin',
      linkedin: null,
      portfolio: 'https://dnikulshin.github.io',
      skills: [{ id: 1, name: 'TypeScript', profileId: 1 }],
      experiences: [
        {
          id: 1,
          company: 'Tech Corp',
          position: 'Software Engineer',
          period: '2024',
          achievements: null,
          profileId: 1,
        },
      ],
      projects: [
        {
          id: 1,
          name: 'project-demo',
          url: 'https://github.com/example/demo',
          profileId: 1,
        },
      ],
    };
    mockPrisma.profile.findFirst.mockResolvedValue(mockDbProfile);

    const result = await service.getProfile();

    expect(mockPrisma.profile.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.profile.findFirst).toHaveBeenCalledWith({
      include: {
        skills: true,
        experiences: true,
        projects: true,
      },
    });
    expect(result).toEqual(mockDbProfile);
  });

  it('returns null when profile does not exist', async () => {
    mockPrisma.profile.findFirst.mockResolvedValue(null);

    const result = await service.getProfile();

    expect(result).toBeNull();
  });

  it('re-throws database errors from Prisma', async () => {
    mockPrisma.profile.findFirst.mockRejectedValue(new Error('DB unavailable'));

    await expect(service.getProfile()).rejects.toThrow('DB unavailable');
  });
});
