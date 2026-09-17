import { Resolver, Query } from '@nestjs/graphql';
import { Profile } from './models/profile.model.js';
import { ProfileService } from './profile.service.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, { nullable: true })
  async profile(): Promise<Profile | null> {
    return this.profileService.getProfile();
  }
}
