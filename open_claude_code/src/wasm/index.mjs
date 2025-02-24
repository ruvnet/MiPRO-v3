/**
 * WASM UI module for Claude Code
 * Provides a WebAssembly-powered UI framework for terminal applications
 */

// Export all components from the UI system
export * from './ui-components.mjs';
export * from './layout-engine.mjs';
export * from './terminal-renderer.mjs';

// Re-export the createRenderer function for easy access
import { createRenderer } from './terminal-renderer.mjs';
import { createConversationUI } from './conversation-ui.mjs';
export { createRenderer, createConversationUI };

/**
 * Create a simple demo UI
 * @param {TerminalRenderer} renderer - The terminal renderer
 * @returns {Promise<void>}
 */
export async function createDemoUI(renderer) {
  // Create a header
  const header = renderer.createComponent('box', {
    id: 'header',
    height: 3,
    border: true,
    borderStyle: 'single',
    style: {
      backgroundColor: '#333',
      color: 'white',
    },
  });
  
  // Add header title
  const headerTitle = renderer.createComponent('text', {
    id: 'headerTitle',
    text: 'Open Claude',
    style: {
      fontWeight: 'bold',
      color: 'white',
    },
  });
  
  header.addChild(headerTitle);
  
  // Create main content area
  const content = renderer.createComponent('box', {
    id: 'content',
    flexDirection: 'row',
    border: false,
    style: {
      backgroundColor: 'transparent',
    },
  });
  
  // Create sidebar
  const sidebar = renderer.createComponent('box', {
    id: 'sidebar',
    width: 20,
    border: true,
    borderStyle: 'single',
    style: {
      backgroundColor: '#222',
      color: 'white',
    },
  });
  
  // Add items to sidebar
  const sidebarItems = [
    'Files',
    'Search',
    'Git',
    'Settings',
    'Help',
  ];
  
  let y = 1;
  for (const item of sidebarItems) {
    const sidebarItem = renderer.createComponent('text', {
      text: item,
      style: {
        color: 'white',
      },
    });
    sidebar.addChild(sidebarItem);
    y++;
  }
  
  // Create main panel
  const mainPanel = renderer.createComponent('box', {
    id: 'mainPanel',
    border: true,
    borderStyle: 'single',
    style: {
      backgroundColor: 'black',
      color: 'white',
    },
  });
  
  // Add welcome message to main panel
  const welcomeText = renderer.createComponent('text', {
    id: 'welcomeText',
    text: 'Welcome to Open Claude!',
    style: {
      color: 'green',
      fontWeight: 'bold',
    },
  });
  
  const infoText = renderer.createComponent('text', {
    id: 'infoText',
    text: 'This UI is powered by WebAssembly',
    style: {
      color: 'cyan',
    },
  });
  
  mainPanel.addChild(welcomeText);
  mainPanel.addChild(infoText);
  
  // Add sidebar and main panel to content
  content.addChild(sidebar);
  content.addChild(mainPanel);
  
  // Create input box
  const inputBox = renderer.createComponent('box', {
    id: 'inputBox',
    height: 5,
    border: true,
    borderStyle: 'single',
    style: {
      backgroundColor: '#333',
      color: 'white',
    },
  });
  
  // Add input field
  const input = renderer.createComponent('input', {
    id: 'commandInput',
    placeholder: 'Type a command...',
    focus: true,
    style: {
      color: 'white',
      backgroundColor: 'transparent',
    },
  });
  
  const inputLabel = renderer.createComponent('text', {
    id: 'inputLabel',
    text: '> ',
    style: {
      color: 'green',
      fontWeight: 'bold',
    },
  });
  
  // Create input container to hold label and input
  const inputContainer = renderer.createComponent('box', {
    id: 'inputContainer',
    flexDirection: 'row',
    height: 1,
    style: {
      backgroundColor: 'transparent',
    },
  });
  
  inputContainer.addChild(inputLabel);
  inputContainer.addChild(input);
  inputBox.addChild(inputContainer);
  
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
  
  // Add all components to root
  renderer.ui.root.addChild(header);
  renderer.ui.root.addChild(content);
  renderer.ui.root.addChild(inputBox);
  renderer.ui.root.addChild(statusBar);
  
  // Render the UI
  renderer.render();
}

/**
 * Initialize the WASM UI
 * @returns {Promise<Object>} The UI system
 */
export async function initWasmUI() {
  try {
    // Create renderer
    const renderer = await createRenderer();
    
    // Return the renderer
    return {
      renderer,
      createDemoUI: () => createDemoUI(renderer),
    };
  } catch (error) {
    console.error('Failed to initialize WASM UI:', error);
    throw error;
  }
}