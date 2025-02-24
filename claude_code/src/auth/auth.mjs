/**
 * Authentication module
 * Handles OAuth flow with Anthropic Console
 */

import fs from 'fs/promises';
import path from 'path';
import { getConfigPath } from '../config/paths.mjs';

// Auth state 
let authToken = null;

/**
 * Authenticate with Anthropic API
 * Handles the full OAuth flow if needed
 */
export async function authenticate() {
  // First check if we already have credentials
  const token = await getStoredToken();
  
  if (token) {
    authToken = token;
    return token;
  }
  
  // Would implement OAuth flow here
  // This is a placeholder
  return null;
}

/**
 * Get stored authentication token
 */
async function getStoredToken() {
  try {
    const configPath = getConfigPath();
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);
    return config.token;
  } catch (error) {
    // File doesn't exist or is invalid
    return null;
  }
}

/**
 * Store authentication token
 */
export async function storeToken(token) {
  const configPath = getConfigPath();
  const config = { token };
  await fs.mkdir(path.dirname(configPath), { recursive: true });
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  authToken = token;
}