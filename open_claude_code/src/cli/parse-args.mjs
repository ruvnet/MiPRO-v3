/**
 * Command-line argument parser
 */

/**
 * Parse command line arguments
 */
export function parseArgs(argv) {
  const args = argv.slice(2); // Remove 'node' and script name
  const options = {
    help: false,
    version: false,
    debug: false,
    file: null
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '-v' || arg === '--version') {
      options.version = true;
    } else if (arg === '--debug') {
      options.debug = true;
    } else if (arg === '-f' || arg === '--file') {
      if (i + 1 < args.length) {
        options.file = args[++i];
      }
    }
  }
  
  return options;
}

/**
 * Print help information
 */
export function printHelp() {
  console.log(`
Usage: claude [options]

Options:
  -h, --help     Show this help message
  -v, --version  Show version information
  --debug        Enable debug mode
  -f, --file     Read input from file
  `);
}