/**
 * Terminal UI module
 * Handles terminal rendering and user interaction
 */

import readline from 'readline';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Display a welcome message
 */
export function showWelcome() {
  console.log('Welcome to Open Claude');
  console.log('Type /help for a list of commands');
}

/**
 * Print a message to the terminal
 */
export function print(message) {
  console.log(message);
}

/**
 * Ask a question and get user input
 */
export function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Close the terminal interface
 */
export function close() {
  rl.close();
}

/**
 * Display an error message
 */
export function showError(message) {
  console.error(`Error: ${message}`);
}

/**
 * Format and display Claude's response
 */
export function showResponse(response) {
  console.log(`\nOpen Claude: ${response}\n`);
}