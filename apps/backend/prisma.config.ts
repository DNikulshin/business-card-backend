import 'dotenv/config';
import { defineConfig, type PrismaConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@127.0.0.1:5433/business_card?schema=public',
  },
}) satisfies PrismaConfig;
