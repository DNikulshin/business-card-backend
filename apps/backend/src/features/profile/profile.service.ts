import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service.js';
import { Profile } from './models/profile.model.js';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(): Promise<Profile | null> {
    const profile = await this.prisma.profile.findFirst({
      include: {
        skills: true,
        experiences: true,
        projects: true,
      },
    });

    return profile || null;
  }
}
