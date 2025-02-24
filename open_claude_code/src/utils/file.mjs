/**
 * File utilities module
 * Handles file system operations
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Read a file from the file system
 */
export async function readFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Write content to a file
 */
export async function writeFile(filePath, content) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get list of files in a directory
 */
export async function listFiles(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    return files;
  } catch (error) {
    console.error(`Error listing files in ${dirPath}:`, error);
    throw error;
  }
}