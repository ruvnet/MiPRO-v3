/**
 * Path utilities for configuration files
 */

import os from 'os';
import path from 'path';
import { APP_NAME } from './constants.mjs';

/**
 * Get configuration directory path
 */
export function getConfigDir() {
  // Use OS-specific config directories
  const homeDir = os.homedir();
  
  if (process.platform === 'win32') {
    return path.join(homeDir, 'AppData', 'Roaming', APP_NAME);
  } else if (process.platform === 'darwin') {
    return path.join(homeDir, 'Library', 'Application Support', APP_NAME);
  } else {
    // Linux, BSD, etc.
    return path.join(homeDir, '.config', APP_NAME);
  }
}

/**
 * Get path to the config file
 */
export function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

/**
 * Get path to the log file
 */
export function getLogPath() {
  return path.join(getConfigDir(), 'logs.txt');
}