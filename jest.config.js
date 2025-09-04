import { defaults } from 'jest-config';

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  collectCoverageFrom: ['client/src/**/*.{ts,tsx}', 'server/**/*.{ts,tsx}'],
  coverageThreshold: { global: { branches: 70, functions: 70, lines: 70, statements: 70 } },
};

