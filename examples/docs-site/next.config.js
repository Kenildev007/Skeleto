const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['skeleto', '@skeleto/web', '@skeleto/core'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'skeleto/styles.css': path.resolve(__dirname, '../../packages/web/src/styles.css'),
      'skeleto': path.resolve(__dirname, '../../packages/web/src/index.ts'),
      '@skeleto/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@skeleto/web': path.resolve(__dirname, '../../packages/web/src/index.ts'),
    };
    return config;
  },
};

module.exports = nextConfig;
