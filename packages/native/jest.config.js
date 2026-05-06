/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
  moduleNameMapper: {
    '^@skeleton-auto/core$': '<rootDir>/../core/src/index.ts',
    '^react-native$': '<rootDir>/test-mocks/react-native.ts',
    '^react-native-reanimated$': '<rootDir>/test-mocks/reanimated.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', module: 'commonjs', target: 'es2020', strict: true, esModuleInterop: true } }],
  },
};
