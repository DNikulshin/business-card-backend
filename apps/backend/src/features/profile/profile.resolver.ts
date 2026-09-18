import { Resolver, Query } from '@nestjs/graphql';
import { ProfileService } from './profile.service.js';
import { Profile } from './models/profile.model.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, { name: 'profile', nullable: true })
  async profile(): Promise<Profile | null> {
    const profile = await this.profileService.getProfile();
    return profile || null;
  }
}
