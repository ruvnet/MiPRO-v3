#!/usr/bin/env node

/**
 * WASM UI Demo for Claude Code
 * Run this script to see a demo of the WASM UI capabilities
 */

import { initWasmUI } from './index.mjs';

/**
 * Run the demo
 */
async function runDemo() {
  try {
    console.log('Initializing WASM UI...');
    
    // Initialize the UI
    const ui = await initWasmUI();
    
    console.log('Creating demo UI...');
    
    // Create the demo UI
    await ui.createDemoUI();
    
    console.log('Demo UI created!');
    console.log('Press Ctrl+C to exit');
    
    // Handle process termination
    process.on('SIGINT', () => {
      // Clean up resources
      ui.renderer.cleanup();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
runDemo();