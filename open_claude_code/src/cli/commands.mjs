/**
 * CLI commands handler
 * Processes special commands like /help, /compact, etc.
 */

import { VERSION } from '../config/constants.mjs';
import * as ui from '../terminal/ui.mjs';
import { initWasmUI } from '../wasm/index.mjs';

// Available commands
const COMMANDS = {
  help: {
    description: 'Show help information',
    handler: handleHelp
  },
  compact: {
    description: 'Compact and continue the conversation',
    handler: handleCompact
  },
  version: {
    description: 'Show version information',
    handler: handleVersion
  },
  quit: {
    description: 'Exit the application',
    handler: handleQuit
  },
  bug: {
    description: 'Report a bug',
    handler: handleBugReport
  },
  ui: {
    description: 'Switch to WASM UI mode',
    handler: handleWasmUI
  }
};

/**
 * Check if input is a command
 */
export function isCommand(input) {
  return input.startsWith('/');
}

/**
 * Process a command
 */
export async function processCommand(input) {
  const commandName = input.slice(1).split(' ')[0];
  
  if (COMMANDS[commandName]) {
    return await COMMANDS[commandName].handler(input);
  } else {
    ui.showError(`Unknown command: ${commandName}`);
    return false;
  }
}

/**
 * Handle /help command
 */
function handleHelp() {
  ui.print('\nAvailable commands:');
  for (const [name, { description }] of Object.entries(COMMANDS)) {
    ui.print(`  /${name} - ${description}`);
  }
  ui.print('\nYou can also ask Claude anything about your code or project.');
  return true;
}

/**
 * Handle /compact command
 */
function handleCompact() {
  ui.print('Compacting conversation and continuing...');
  // Actual implementation would compact the conversation context
  return true;
}

/**
 * Handle /version command
 */
function handleVersion() {
  ui.print(`Claude Code version: ${VERSION}`);
  return true;
}

/**
 * Handle /quit command
 */
function handleQuit() {
  ui.print('Goodbye!');
  process.exit(0);
}

/**
 * Handle /bug command
 */
function handleBugReport(input) {
  ui.print('Thank you for reporting a bug!');
  ui.print('Please file a GitHub issue at: https://github.com/anthropics/claude-code/issues');
  return true;
}

/**
 * Handle /ui command to switch to WASM UI mode
 */
async function handleWasmUI(input) {
  ui.print('Switching to WASM UI mode...');
  
  try {
    // Check if we want demo or conversation mode
    const args = input.split(' ');
    const mode = args[1] || 'demo';
    
    if (mode === 'demo') {
      // Initialize the WASM UI
      const wasmUI = await initWasmUI();
      
      // Create the demo UI
      await wasmUI.createDemoUI();
      
      ui.print('WASM UI demo initialized. Press Ctrl+C to exit UI mode.');
      
      // Handle graceful exit
      process.once('SIGINT', () => {
        // Clean up WASM UI resources
        wasmUI.renderer.cleanup();
        ui.print('Exited WASM UI demo mode.');
      });
    } else if (mode === 'conversation') {
      // Import the conversation UI
      const { createConversationUI } = await import('../wasm/conversation-ui.mjs');
      
      // Create a mock conversation for testing
      const conversation = [
        { role: 'assistant', content: 'Hello! How can I help you today?' }
      ];
      
      // Mock send message function
      const sendMessage = async (text) => {
        // Check if it's a command
        if (text.startsWith('/')) {
          const command = text.slice(1).split(' ')[0];
          if (command === 'help') {
            return 'Available commands: /help, /quit';
          } else if (command === 'quit') {
            return 'Goodbye!';
          } else {
            return `Unknown command: ${command}`;
          }
        }
        
        // Simulate response delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return a simple response
        return `You said: "${text}". This is a simulated response from Claude.`;
      };
      
      // Create the conversation UI
      const conversationUI = await createConversationUI(conversation, sendMessage);
      
      ui.print('WASM conversation UI initialized. Press Ctrl+C to exit UI mode.');
      
      // Handle graceful exit
      process.once('SIGINT', () => {
        // Clean up conversation UI resources
        conversationUI.cleanup();
        ui.print('Exited WASM conversation UI mode.');
      });
    } else {
      ui.showError(`Unknown UI mode: ${mode}`);
      return false;
    }
    
    return true;
  } catch (error) {
    ui.showError(`Failed to initialize WASM UI: ${error.message}`);
    return false;
  }
}