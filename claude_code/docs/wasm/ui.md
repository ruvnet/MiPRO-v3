# WASM UI Framework

The Claude Code WASM UI framework provides a flexible, efficient way to create rich terminal user interfaces powered by WebAssembly. This document explains how to use the framework and its components.

## Architecture

The WASM UI framework is built on several layers:

1. **Yoga Layout Engine (WebAssembly)**: Provides the core layout capabilities using a flexbox-like system
2. **Layout Engine**: JavaScript wrapper around the Yoga WASM module
3. **UI Components**: Building blocks for creating user interfaces
4. **Terminal Renderer**: Renders components to the terminal

```
┌─────────────────────────────────────────┐
│            Terminal Renderer            │
├─────────────────────────────────────────┤
│              UI Components              │
├─────────────────────────────────────────┤
│               Layout Engine             │
├─────────────────────────────────────────┤
│          Yoga WASM Module               │
└─────────────────────────────────────────┘
```

## Getting Started

To use the WASM UI in your project:

```javascript
import { initWasmUI } from './wasm/index.mjs';

async function main() {
  // Initialize the UI
  const ui = await initWasmUI();
  
  // Get the renderer
  const { renderer } = ui;
  
  // Create components
  const box = renderer.createComponent('box', {
    id: 'myBox',
    width: 50,
    height: 10,
    border: true,
    style: {
      backgroundColor: '#333',
      color: 'white',
    },
  });
  
  // Add components to the UI
  renderer.ui.root.addChild(box);
  
  // Render the UI
  renderer.render();
}

main();
```

## Components

The framework includes several built-in components:

### UIComponent (Base)

Base class for all UI components with common properties and methods.

```javascript
const component = renderer.createComponent('component', {
  id: 'myComponent',
  width: 10,
  height: 5,
  content: 'Hello',
  style: {
    color: 'white',
    backgroundColor: 'blue',
  },
});
```

### Box

Container component that can have borders and contain other components.

```javascript
const box = renderer.createComponent('box', {
  id: 'myBox',
  width: 50,
  height: 10,
  border: true,
  borderStyle: 'single', // 'single' or 'double'
  style: {
    backgroundColor: '#333',
    color: 'white',
  },
});
```

### Text

Simple component for displaying text.

```javascript
const text = renderer.createComponent('text', {
  id: 'myText',
  text: 'Hello, World!',
  style: {
    color: 'green',
    fontWeight: 'bold',
  },
});
```

### Input

Text input field that can receive keyboard focus.

```javascript
const input = renderer.createComponent('input', {
  id: 'myInput',
  placeholder: 'Type here...',
  value: '',
  focus: true,
  style: {
    color: 'white',
    backgroundColor: 'transparent',
  },
});
```

### Button

Interactive button that can be clicked.

```javascript
const button = renderer.createComponent('button', {
  id: 'myButton',
  label: 'Click Me',
  onClick: () => console.log('Button clicked!'),
  style: {
    backgroundColor: '#555',
    color: 'white',
  },
});
```

### ProgressBar

Progress indicator with customizable appearance.

```javascript
const progressBar = renderer.createComponent('progressbar', {
  id: 'myProgress',
  value: 50, // 0-100
  showLabel: true,
  style: {
    fillColor: 'green',
    backgroundColor: 'gray',
    labelColor: 'white',
  },
});
```

## Layout System

The layout system is based on flexbox principles, making it easy to create responsive layouts.

```javascript
// Create a row layout
const row = renderer.createComponent('box', {
  id: 'rowLayout',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

// Create a column layout
const column = renderer.createComponent('box', {
  id: 'columnLayout',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
});
```

## Styling

Components can be styled using a CSS-like object syntax:

```javascript
component.setStyle({
  color: 'white',
  backgroundColor: '#333',
  fontWeight: 'bold',
  italic: true,
  underline: true,
});
```

### Available Style Properties

- `color`: Text color ('red', 'green', 'blue', etc. or hex codes like '#FF5500')
- `backgroundColor`: Background color
- `fontWeight`: 'normal' or 'bold'
- `fontStyle`: 'normal' or 'italic'
- `textDecoration`: 'none' or 'underline'
- `textAlign`: 'left', 'center', or 'right'

## Handling Events

The UI system can handle keyboard and mouse events:

```javascript
// Add a custom keyboard handler
renderer.ui.handleKeyboard = (event) => {
  if (event.key === 'f5') {
    console.log('F5 pressed!');
    return true; // Event handled
  }
  return false; // Pass to default handler
};

// Add a custom mouse handler
renderer.ui.handleMouse = (event) => {
  if (event.type === 'mousedown') {
    console.log(`Mouse clicked at ${event.x},${event.y}`);
    return true; // Event handled
  }
  return false; // Pass to default handler
};
```

## Rendering Process

1. Calculate layout using Yoga's flexbox engine
2. Render components to an in-memory buffer
3. Optimized rendering to terminal (only changed cells)

## Memory Management

WASM components need explicit cleanup to free memory:

```javascript
// Clean up resources
renderer.cleanup();
```

## Advanced Usage

### Custom Components

You can create custom components by extending the base classes:

```javascript
import { UIComponent } from './wasm/index.mjs';

class CustomComponent extends UIComponent {
  constructor(options = {}) {
    super(options);
    this.customProp = options.customProp || '';
  }
  
  render(ctx) {
    // Custom rendering logic
    super.render(ctx);
    
    // Additional rendering
    const layout = this.getComputedLayout();
    ctx.drawText(
      layout.left + 1,
      layout.top + 1,
      this.customProp,
      { color: 'yellow' }
    );
  }
}
```

### Performance Optimization

For optimal performance:

1. Only update components when necessary
2. Batch updates where possible
3. Use `requestRender()` to schedule updates
4. Limit component nesting depth

## Example: Creating a Dialog

```javascript
function createDialog(renderer, options) {
  const { title, message, width, height } = options;
  
  // Create dialog box
  const dialog = renderer.createComponent('box', {
    id: 'dialog',
    width: width || 40,
    height: height || 10,
    border: true,
    borderStyle: 'double',
    style: {
      backgroundColor: '#222',
    },
  });
  
  // Add title
  const titleComponent = renderer.createComponent('text', {
    id: 'dialogTitle',
    text: title || 'Dialog',
    style: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  
  // Add message
  const messageComponent = renderer.createComponent('text', {
    id: 'dialogMessage',
    text: message || '',
    style: {
      color: 'white',
    },
  });
  
  // Add close button
  const closeButton = renderer.createComponent('button', {
    id: 'dialogClose',
    label: 'Close',
    onClick: () => {
      dialog.hide();
      renderer.render();
    },
  });
  
  // Add components to dialog
  dialog.addChild(titleComponent);
  dialog.addChild(messageComponent);
  dialog.addChild(closeButton);
  
  // Add dialog to root
  renderer.ui.root.addChild(dialog);
  
  // Position dialog in center
  // This will be handled by the layout engine
  
  // Render the UI
  renderer.render();
  
  return dialog;
}
```

## Troubleshooting

- **Memory Leaks**: Ensure you call `cleanup()` when components are no longer needed
- **Rendering Issues**: Check terminal capabilities and color support
- **Performance Problems**: Reduce update frequency and simplify component structure
- **Layout Errors**: Verify flexbox properties and container dimensions
- **WASM Errors**: The system uses a robust fallback mechanism if WASM fails to load or errors occur
- **Mock Implementation Limitations**: Some advanced features may be limited in the fallback implementation

## Development Environment

For development purposes, you can run the CLI directly from the source directory:

```bash
cd /workspaces/MiPRO-v3/claude_code/src && node index.mjs
```

This approach is recommended for development as it:

1. Uses the mock implementation by default
2. Avoids issues with WASM module loading
3. Provides clearer error messages
4. Allows for easier debugging of the UI components

After making changes to WASM UI files, you can immediately test them using this method without needing to rebuild or reinstall the application.

### Error Handling and Fallbacks

The WASM UI framework implements multi-layered error handling and fallbacks:

1. **WASM Loading**: If the WASM module fails to load, a JavaScript mock implementation is used automatically
2. **Component Creation**: If component creation fails, minimal fallback components are provided
3. **Rendering**: If rendering fails, the system will attempt to recover with minimal rendering
4. **Events**: If event handling fails, the system will continue operating with reduced functionality

This design ensures that the UI will continue to function even if parts of the system encounter errors.

```javascript
// Example: Creating a UI with error handling
try {
  // Initialize the WASM UI
  const ui = await initWasmUI();
  
  // Create components and render UI
  // ...
} catch (error) {
  console.error('Failed to initialize UI:', error);
  // System will provide fallbacks automatically
}
```

## Further Resources

- [Yoga Layout Documentation](https://yogalayout.com/docs)
- [Terminal ANSI Color Codes](https://en.wikipedia.org/wiki/ANSI_escape_code)
- [WebAssembly Documentation](https://webassembly.org/docs/)