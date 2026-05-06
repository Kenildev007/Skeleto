import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'skeleto/styles.css',
        replacement: path.resolve(__dirname, '../../packages/web/src/styles.css'),
      },
      {
        find: 'skeleto',
        replacement: path.resolve(__dirname, '../../packages/web/src/index.ts'),
      },
      {
        find: '@skeleto/core',
        replacement: path.resolve(__dirname, '../../packages/core/src/index.ts'),
      },
      {
        find: '@skeleto/web',
        replacement: path.resolve(__dirname, '../../packages/web/src/index.ts'),
      },
    ],
  },
});
