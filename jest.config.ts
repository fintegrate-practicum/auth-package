import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testMatch: ['**/*.spec.ts'],
  roots: ['<rootDir>/src'],
};

export default config;
