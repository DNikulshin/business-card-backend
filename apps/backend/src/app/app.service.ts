import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async checkHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'disconnected',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
