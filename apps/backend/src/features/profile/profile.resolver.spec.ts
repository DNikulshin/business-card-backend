import { vi, describe, beforeEach, it, expect } from 'vitest';
import { ProfileResolver } from './profile.resolver.js';
import { ProfileService } from './profile.service.js';

describe('ProfileResolver', () => {
  let resolver: ProfileResolver;
  let mockService: { getProfile: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockService = {
      getProfile: vi.fn(),
    };

    resolver = new ProfileResolver(mockService as unknown as ProfileService);
  });

  it('delegates call to profileService and returns profile data', async () => {
    const mockProfile = {
      id: 1,
      name: 'Dmitry Nikulshin',
      description: 'Fullstack developer',
      github: 'https://github.com/DNikulshin',
      linkedin: null,
      portfolio: 'https://dnikulshin.github.io',
      skills: [],
      experiences: [],
      projects: [],
    };
    mockService.getProfile.mockResolvedValue(mockProfile);

    const result = await resolver.profile();

    expect(mockService.getProfile).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockProfile);
  });

  it('returns null when service returns null', async () => {
    mockService.getProfile.mockResolvedValue(null);

    const result = await resolver.profile();

    expect(mockService.getProfile).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it('re-throws error when service throws', async () => {
    mockService.getProfile.mockRejectedValue(new Error('DB unavailable'));

    await expect(resolver.profile()).rejects.toThrow('DB unavailable');
  });
});
