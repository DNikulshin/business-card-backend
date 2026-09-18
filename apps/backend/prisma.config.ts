import 'dotenv/config';
import { defineConfig, type PrismaConfig } from 'prisma/config';
import fs from 'node:fs';

const isDist = fs.existsSync(
  new URL('./dist/shared/config.js', import.meta.url),
);
const { DEFAULT_DATABASE_URL } = await (isDist
  ? import('./dist/shared/config.js')
  : import('./src/shared/config.js'));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
  },
}) satisfies PrismaConfig;
