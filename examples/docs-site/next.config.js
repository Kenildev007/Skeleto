const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['skeleton-auto', '@skeleton-auto/web', '@skeleton-auto/core'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'skeleton-auto/styles.css': path.resolve(__dirname, '../../packages/web/src/styles.css'),
      'skeleton-auto': path.resolve(__dirname, '../../packages/web/src/index.ts'),
      '@skeleton-auto/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@skeleton-auto/web': path.resolve(__dirname, '../../packages/web/src/index.ts'),
    };
    return config;
  },
};

module.exports = nextConfig;
