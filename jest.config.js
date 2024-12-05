module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
      '^@core/(.*)$': '<rootDir>/src/core/$1',
      '^@geolocation/(.*)$': '<rootDir>/src/geolocation/$1',
      '^@types/(.*)$': '<rootDir>/src/types/$1'
    },
    coverageThreshold: {
      global: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90
      }
    },
    collectCoverageFrom: [
      'src/**/*.{js,ts}',
      '!src/types/**/*'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
  }