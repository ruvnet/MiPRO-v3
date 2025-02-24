/**
 * WASM-powered conversation UI for Claude Code
 * Provides a rich UI experience for the conversation loop
 */

import { createRenderer } from './terminal-renderer.mjs';

/**
 * Create a conversation UI using WASM
 * @param {Array} conversation - The current conversation history
 * @param {Function} sendMessage - Function to send a message to Claude
 * @returns {Promise<Object>} The UI controller
 */
export async function createConversationUI(conversation, sendMessage) {
  try {
    // Initialize the renderer
    const renderer = await createRenderer();
  
  // Create the main layout
  const root = renderer.ui.root;
  
  // Create header
  const header = renderer.createComponent('box', {
    id: 'header',
    height: 3,
    border: true,
    borderStyle: 'single',
    style: {
      backgroundColor: '#222',
      color: 'white',
    },
  });
  
  // Add header title
  const headerTitle = renderer.createComponent('text', {
    id: 'headerTitle',
    text: 'Open Claude',
    style: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  
  header.addChild(headerTitle);
  
  // Create conversation container
  const conversationContainer = renderer.createComponent('box', {
    id: 'conversation',
    border: true,
    borderStyle: 'single',
    style: {
      backgroundColor: 'black',
      color: 'white',
    },
  });
  
  // Create input area
  const inputArea = renderer.createComponent('box', {
    id: 'inputArea',
    height: 4,
    border: true,
    borderStyle: 'single',
    style: {
      backgroundColor: '#333',
      color: 'white',
    },
  });
  
  // Create prompt text
  const promptText = renderer.createComponent('text', {
    id: 'promptText',
    text: '> ',
    style: {
      color: 'green',
      fontWeight: 'bold',
    },
  });
  
  // Create input field
  const inputField = renderer.createComponent('input', {
    id: 'input',
    placeholder: 'Type a message or command...',
    focus: true,
    style: {
      color: 'white',
      backgroundColor: 'transparent',
    },
  });
  
  // Create input container (for prompt and input field)
  const inputContainer = renderer.createComponent('box', {
    id: 'inputContainer',
    flexDirection: 'row',
    height: 1,
    style: {
      backgroundColor: 'transparent',
    },
  });
  
  inputContainer.addChild(promptText);
  inputContainer.addChild(inputField);
  
  // Add input container to input area
  inputArea.addChild(inputContainer);
  
  // Create status bar
  const statusBar = renderer.createComponent('box', {
    id: 'statusBar',
    height: 1,
    style: {
      backgroundColor: '#444',
      color: 'white',
    },
  });
  
  // Add status text
  const statusText = renderer.createComponent('text', {
    id: 'statusText',
    text: 'Ready',
    style: {
      color: 'green',
    },
  });
  
  statusBar.addChild(statusText);
  
  // Add components to root
  root.addChild(header);
  root.addChild(conversationContainer);
  root.addChild(inputArea);
  root.addChild(statusBar);
  
  // Render the UI
  renderer.render();
  
  // Function to update conversation display
  function updateConversation() {
    // Clear existing conversation display
    conversationContainer.children = [];
    
    // Calculate available height for conversation
    const layout = conversationContainer.getComputedLayout();
    const maxMessages = Math.max(1, Math.floor(layout.height - 2) - 1);
    
    // Get last N messages to display
    const messages = conversation.slice(-maxMessages);
    
    // Add each message to the conversation container
    let y = 0;
    for (const message of messages) {
      const role = message.role === 'user' ? 'You' : 'Open Claude';
      const color = message.role === 'user' ? 'cyan' : 'green';
      
      // Create message component
      const messageComponent = renderer.createComponent('text', {
        text: `${role}: ${message.content}`,
        style: {
          color,
        },
      });
      
      conversationContainer.addChild(messageComponent);
      y++;
    }
    
    // Render the updated UI
    renderer.render();
  }
  
  // Initial conversation update
  updateConversation();
  
  // Handle input submission
  const handleSubmit = async () => {
    const text = inputField.value.trim();
    
    if (!text) return;
    
    // Clear input field
    inputField.value = '';
    inputField.cursorPos = 0;
    
    // Update status
    statusText.setText('Sending...');
    renderer.render();
    
    // Add user message to conversation
    conversation.push({ role: 'user', content: text });
    updateConversation();
    
    try {
      // Send message and get response
      const response = await sendMessage(text);
      
      // Add assistant response to conversation
      conversation.push({ role: 'assistant', content: response });
      updateConversation();
      
      // Update status
      statusText.setText('Ready');
    } catch (error) {
      // Update status
      statusText.setText(`Error: ${error.message}`);
    }
    
    // Render the updated UI
    renderer.render();
  };
  
  // Override keyboard handler to handle Enter key
  renderer.ui.handleKeyboard = (event) => {
    if (event.key === 'return' || event.key === 'enter') {
      handleSubmit();
      return true;
    }
    
    // Let input field handle other keys
    if (inputField.handleKeyboard(event)) {
      renderer.render();
      return true;
    }
    
    return false;
  };
  
  // Return the UI controller
  return {
    renderer,
    updateConversation,
    cleanup: () => {
      renderer.cleanup();
    },
  };
  } catch (error) {
    console.error('Failed to create conversation UI:', error);
    // Return a minimal object that won't crash
    return {
      renderer: {
        cleanup: () => {}
      },
      updateConversation: () => {},
      cleanup: () => {}
    };
  }
}