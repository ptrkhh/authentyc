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
// CI runs Node 20, which has no native .ts support; a .ts config there demands
// ts-node (absent), which broke CI. A plain .js config works on every Node.
module.exports = createJestConfig(config);
