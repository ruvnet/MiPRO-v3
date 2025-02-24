#!/usr/bin/env node

// This is the main entry point that replaces the original cli.mjs
import { initialize } from './src/index.mjs';

// Start the application
initialize().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
