const nextJest = require('next/jest.js');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
};

// Kept as .js (not .ts) so Jest loads its config without a TypeScript loader.
// A .ts config demands ts-node (not a dependency here), which broke CI once
// already. A plain .js config works on every Node version, no loader needed.
module.exports = createJestConfig(config);
