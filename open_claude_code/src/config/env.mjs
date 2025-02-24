/**
 * Environment variable loader
 * Loads environment variables from .env file
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from 'dotenv';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..', '..');

/**
 * Load environment variables from .env file
 */
export function loadEnv() {
  // Try to load from .env file in the root directory
  const envPath = resolve(rootDir, '.env');
  
  if (fs.existsSync(envPath)) {
    const result = config({ path: envPath });
    
    if (result.error) {
      console.warn(`Warning: Error loading .env file: ${result.error.message}`);
    } else {
      console.log('Environment variables loaded from .env file');
    }
  } else {
    // Try to load from sample.env if .env doesn't exist
    const sampleEnvPath = resolve(rootDir, 'src', 'sample.env');
    
    if (fs.existsSync(sampleEnvPath)) {
      console.warn('Warning: No .env file found. Using sample.env for reference.');
      console.warn('Please create a .env file with your actual configuration.');
      
      // Copy sample.env to .env
      try {
        fs.copyFileSync(sampleEnvPath, envPath);
        console.log('Created .env file from sample.env. Please update it with your configuration.');
      } catch (error) {
        console.warn(`Warning: Could not create .env file: ${error.message}`);
      }
    } else {
      console.warn('Warning: No .env or sample.env file found.');
    }
  }
  
  // Set default values for required environment variables if not set
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('Warning: ANTHROPIC_API_KEY not set. API requests will fail.');
  }
  
  if (!process.env.CLAUDE_MODEL) {
    process.env.CLAUDE_MODEL = 'claude-3-7-sonnet-20250219';
    console.log(`Using default model: ${process.env.CLAUDE_MODEL}`);
  }
}
