/**
 * Entry point for Claude Code CLI
 */

import { initialize } from './cli/app.mjs';
import { parseArgs, printHelp } from './cli/parse-args.mjs';
import { VERSION } from './config/constants.mjs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Parse command line arguments
const options = parseArgs(process.argv);

// Handle command line options
if (options.help) {
  printHelp();
  process.exit(0);
} else if (options.version) {
  console.log(`Claude Code v${VERSION}`);
  process.exit(0);
}

// Enable debug mode if requested
if (options.debug) {
  process.env.DEBUG = 'true';
}

// Start the application
initialize().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
