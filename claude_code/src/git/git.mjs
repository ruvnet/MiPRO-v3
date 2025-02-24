/**
 * Git integration module
 * Handles git operations and repository analysis
 */

import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

/**
 * Check if current directory is a git repository
 */
export async function isGitRepo() {
  try {
    await execFileAsync('git', ['rev-parse', '--is-inside-work-tree']);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get git status information
 */
export async function getStatus() {
  const { stdout } = await execFileAsync('git', ['status', '--porcelain']);
  return stdout.trim();
}

/**
 * Get repository information
 */
export async function getRepoInfo() {
  try {
    const [branchResult, remoteResult] = await Promise.all([
      execFileAsync('git', ['branch', '--show-current']),
      execFileAsync('git', ['remote', '-v'])
    ]);
    
    return {
      currentBranch: branchResult.stdout.trim(),
      remotes: parseRemotes(remoteResult.stdout)
    };
  } catch (error) {
    console.error('Error getting repository information:', error);
    return null;
  }
}

/**
 * Parse git remotes output
 */
function parseRemotes(remotesOutput) {
  const remotes = {};
  const lines = remotesOutput.trim().split('\n');
  
  for (const line of lines) {
    const parts = line.split(/\s+/);
    if (parts.length >= 2) {
      const name = parts[0];
      const url = parts[1];
      remotes[name] = url;
    }
  }
  
  return remotes;
}