import { Module } from '@nestjs/common';
import { ProfileResolver } from './profile.resolver.js';
import { PrismaService } from '../../services/prisma/prisma.service.js';
import { ProfileService } from './profile.service.js';

@Module({
  providers: [ProfileResolver, ProfileService, PrismaService],
  exports: [ProfileResolver],
})
export class ProfileModule {}
