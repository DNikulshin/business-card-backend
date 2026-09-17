import { defineConfig } from 'prisma/config';

const { DATABASE_URL } = await import('./dist/shared/config.js').catch(
  () => import('./src/shared/config.js'),
);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: DATABASE_URL,
  },
});
