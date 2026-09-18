import 'dotenv/config';
import { defineConfig, type PrismaConfig } from 'prisma/config';
import { DEFAULT_DATABASE_URL } from './prisma/constants.js';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
  },
}) satisfies PrismaConfig;
