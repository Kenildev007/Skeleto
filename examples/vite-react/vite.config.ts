import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@kenildev007/skeleto/styles.css',
        replacement: path.resolve(__dirname, '../../packages/web/src/styles.css'),
      },
      {
        find: '@kenildev007/skeleto',
        replacement: path.resolve(__dirname, '../../packages/web/src/index.ts'),
      },
      {
        find: '@kenildev007/skeleto-core',
        replacement: path.resolve(__dirname, '../../packages/core/src/index.ts'),
      },
      {
        find: '@kenildev007/skeleto-web',
        replacement: path.resolve(__dirname, '../../packages/web/src/index.ts'),
      },
    ],
  },
});
