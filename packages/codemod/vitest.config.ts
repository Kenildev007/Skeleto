import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'codemod',
    environment: 'node',
    include: ['src/**/*.test.ts'],
    globals: true,
  },
});
