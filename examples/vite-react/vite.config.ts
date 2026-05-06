import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'skeleton-auto/styles.css',
        replacement: path.resolve(__dirname, '../../packages/web/src/styles.css'),
      },
      {
        find: 'skeleton-auto',
        replacement: path.resolve(__dirname, '../../packages/web/src/index.ts'),
      },
      {
        find: '@skeleton-auto/core',
        replacement: path.resolve(__dirname, '../../packages/core/src/index.ts'),
      },
      {
        find: '@skeleton-auto/web',
        replacement: path.resolve(__dirname, '../../packages/web/src/index.ts'),
      },
    ],
  },
});
