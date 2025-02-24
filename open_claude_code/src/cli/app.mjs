/**
 * Main application module
 * Handles the main application flow and user interaction
 */

import * as ui from '../terminal/ui.mjs';
import * as auth from '../auth/auth.mjs';
import * as api from '../api/client.mjs';
import * as commands from './commands.mjs';
import * as git from '../git/git.mjs';
import { VERSION } from '../config/constants.mjs';
import { loadEnv } from '../config/env.mjs';

/**
 * Initialize the application
 */
export async function initialize() {
  try {
    // Load environment variables
    loadEnv();
    
    // Show welcome message
    ui.showWelcome();
    console.log(`Open Claude v${VERSION}`);
    
    // Bypass authentication for development
    console.log('Authentication bypassed for development');
    // const token = await auth.authenticate();
    // if (!token) {
    //   ui.showError('Authentication failed. Please try again.');
    //   process.exit(1);
    // }
    
    // Check if current directory is a git repository
    const isGitRepo = await git.isGitRepo();
    if (isGitRepo) {
      const repoInfo = await git.getRepoInfo();
      console.log(`Working with repository: ${repoInfo.currentBranch}`);
    }
    
    // Start conversation loop
    await startConversation();
  } catch (error) {
    ui.showError(`Initialization error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Start the conversation loop
 */
async function startConversation() {
  const conversation = [];
  
  while (true) {
    // Get user input
    const input = await ui.prompt('> ');
    
    // Check if it's a command
    if (commands.isCommand(input)) {
      const handled = await commands.processCommand(input);
      if (handled) continue;
    }
    
    // Not a command, send to Claude
    try {
      conversation.push({ role: 'user', content: input });
      
      // Send request to Claude
      const response = await api.sendRequest(conversation);
      
      // Display response
      ui.showResponse(response.response);
      
      // Add response to conversation history
      conversation.push({ role: 'assistant', content: response.response });
      
    } catch (error) {
      ui.showError(`Error communicating with Claude: ${error.message}`);
    }
  }
}
