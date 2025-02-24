/**
 * Search utilities
 * Handles codebase search using ripgrep
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';

const execFileAsync = promisify(execFile);

/**
 * Get the path to the ripgrep binary based on OS and architecture
 */
function getRipgrepPath() {
  const platform = os.platform();
  const arch = os.arch();
  
  let ripgrepDir;
  if (platform === 'win32') {
    ripgrepDir = 'x64-win32';
  } else if (platform === 'darwin') {
    ripgrepDir = arch === 'arm64' ? 'arm64-darwin' : 'x64-darwin';
  } else {
    // Linux and others
    ripgrepDir = arch === 'arm64' ? 'arm64-linux' : 'x64-linux';
  }
  
  const rgPath = path.resolve(
    __dirname, 
    '..', 
    '..', 
    'vendor', 
    'ripgrep', 
    ripgrepDir, 
    platform === 'win32' ? 'rg.exe' : 'rg'
  );
  
  return rgPath;
}

/**
 * Search for a pattern in files
 */
export async function search(pattern, options = {}) {
  const rgPath = getRipgrepPath();
  const args = ['--json', pattern];
  
  if (options.path) {
    args.push(options.path);
  }
  
  if (options.fileTypes) {
    for (const type of options.fileTypes) {
      args.push('--type', type);
    }
  }
  
  try {
    const { stdout } = await execFileAsync(rgPath, args);
    return parseRipgrepOutput(stdout);
  } catch (error) {
    // ripgrep returns non-zero exit code when no matches are found
    if (error.code === 1 && error.stdout) {
      return parseRipgrepOutput(error.stdout);
    }
    console.error('Error executing ripgrep search:', error);
    throw error;
  }
}

/**
 * Parse ripgrep JSON output
 */
function parseRipgrepOutput(output) {
  const results = [];
  const lines = output.trim().split('\n');
  
  for (const line of lines) {
    if (!line) continue;
    
    try {
      const match = JSON.parse(line);
      if (match.type === 'match') {
        results.push({
          path: match.data.path.text,
          line: match.data.line_number,
          content: match.data.lines.text
        });
      }
    } catch (error) {
      console.error('Error parsing ripgrep output:', error);
    }
  }
  
  return results;
}