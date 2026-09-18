import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      DATABASE_URL:
        'postgresql://postgres:postgres@127.0.0.1:5433/business_card?schema=public',
    },
    root: './',
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/main.ts',
        'src/**/*.module.ts',
        'src/**/models/**',
        'src/**/types.ts',
        'src/**/*.types.ts',
        'prisma/seed.ts',
        '**/*.spec.ts',
        'src/app/constants.ts',
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
