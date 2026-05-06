const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Skeleto',
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ['@kenildev007/skeleto', '@kenildev007/skeleto-web', '@kenildev007/skeleto-core'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@kenildev007/skeleto/styles.css': path.resolve(__dirname, '../../packages/web/src/styles.css'),
      '@kenildev007/skeleto': path.resolve(__dirname, '../../packages/web/src/index.ts'),
      '@kenildev007/skeleto-core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@kenildev007/skeleto-web': path.resolve(__dirname, '../../packages/web/src/index.ts'),
    };
    return config;
  },
};

module.exports = nextConfig;
