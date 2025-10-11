/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';

// Separate vitest config for database/backend tests
// Uses Node environment instead of jsdom
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node', // Node environment for database tests
    testTimeout: 30000, // 30 second timeout for database operations
    hookTimeout: 30000,
    teardownTimeout: 30000
  },
});

