import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
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
        branches: 40,
        statements: 90,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
