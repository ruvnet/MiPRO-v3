# Terminal UI Components

Claude Code employs a sophisticated Terminal UI architecture to create a rich, interactive experience within the constraints of a text-based terminal interface.

## Terminal UI Architecture

The Terminal UI system is built on a component-based architecture:

```
┌─────────────────────────────────────────────┐
│              Terminal Renderer              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │ Input       │  │ Output              │   │
│  │ Handler     │  │ Renderer            │   │
│  └─────────────┘  └─────────────────────┘   │
│                                             │
│  ┌─────────────┐  ┌─────────────┐           │
│  │ Command     │  │ Status      │           │
│  │ Processor   │  │ Bar         │           │
│  └─────────────┘  └─────────────┘           │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Content Components                   │    │
│  │                                      │    │
│  │  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │ Message  │  │ Code Block       │  │   │
│  │  │ Bubble   │  │                  │  │   │
│  │  └──────────┘  └──────────────────┘  │   │
│  │                                      │    │
│  │  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │ Progress │  │ Selection        │  │   │
│  │  │ Bar      │  │ Menu             │  │   │
│  │  └──────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

## Core Components

### Terminal Renderer

The main orchestrator that:
- Interfaces with the terminal via standard I/O
- Manages the layout of child components
- Handles terminal resize events
- Optimizes repainting operations

Implementation:

```javascript
class TerminalRenderer {
  constructor(options = {}) {
    this.width = process.stdout.columns;
    this.height = process.stdout.rows;
    this.yogaNode = createYogaNode(); // WASM integration
    this.components = [];
    this.setupResizeHandler();
  }
  
  // Add a component to the renderer
  addComponent(component) {
    this.components.push(component);
    return this;
  }
  
  // Calculate layout and render all components
  render() {
    this.calculateLayout();
    this.clearScreen();
    for (const component of this.components) {
      component.render();
    }
  }
  
  // Handle terminal resize
  setupResizeHandler() {
    process.stdout.on('resize', () => {
      this.width = process.stdout.columns;
      this.height = process.stdout.rows;
      this.render();
    });
  }
}
```

### Input Handler

Manages keyboard input from the user:
- Raw key press handling
- Line editing (with history)
- Command completion
- Special key combinations

### Message Bubbles

Renders chat messages with appropriate styling:
- User messages
- Assistant (Claude) messages
- System messages
- Error messages

```javascript
class MessageBubble {
  constructor(message, options = {}) {
    this.message = message;
    this.role = options.role || 'system';
    this.yogaNode = createYogaNode(); // WASM integration
  }
  
  render() {
    const theme = getThemeForRole(this.role);
    const maxWidth = process.stdout.columns - 4;
    
    // Format the message with appropriate wrapping and styling
    const formattedContent = formatMessage(this.message, maxWidth);
    
    // Apply style based on message role
    const styledContent = applyStyle(formattedContent, theme);
    
    // Render to terminal at calculated position
    const { left, top } = this.yogaNode.getComputedLayout();
    moveCursor(left, top);
    process.stdout.write(styledContent);
  }
}
```

### Code Block

Specialized component for displaying code with:
- Syntax highlighting
- Line numbers
- Copy/edit actions
- Scrolling for long snippets

### Progress Indicators

Visual indicators for long-running operations:
- Spinner for indeterminate progress
- Progress bar for determinate operations
- Task list for multi-step operations

## Terminal Capabilities

Claude Code adapts to the capabilities of the user's terminal:

| Feature               | Fallback                    | Enhanced                           |
|-----------------------|-----------------------------|-----------------------------------|
| Color                 | No color                    | 256 colors or true color          |
| Unicode               | ASCII only                  | Full Unicode with emoji           |
| Cursor Movement       | Line-by-line output         | Arbitrary cursor positioning      |
| Interactive Elements  | Static text with line input | Interactive buttons and menus     |
| Layout                | Simple flow layout          | Yoga-powered flexbox layout       |

## Accessibility Considerations

The terminal UI implements several accessibility features:

- **Screen Reader Support**: All UI elements include screen reader hints when possible
- **Color Contrast**: Themes ensure WCAG AA compliance for color contrast
- **Keyboard Navigation**: All functionality is accessible via keyboard shortcuts
- **Reduced Motion**: Respects system settings for reduced motion

## Implementation Details

### ANSI Escape Sequences

The terminal UI uses ANSI escape sequences for styling and cursor control:

```javascript
// Helper functions for terminal control
const ansi = {
  cursorTo: (x, y) => `\x1b[${y};${x}H`,
  clearScreen: () => `\x1b[2J\x1b[H`,
  bold: text => `\x1b[1m${text}\x1b[22m`,
  color: (text, color) => `\x1b[38;5;${color}m${text}\x1b[39m`,
  bgColor: (text, color) => `\x1b[48;5;${color}m${text}\x1b[49m`,
  // Additional control sequences...
};
```

### Layout with WebAssembly

The UI leverages the Yoga layout engine (via WebAssembly) for flexible, responsive layouts:

1. Create a layout tree mirroring the component hierarchy
2. Set constraints and styling properties
3. Calculate final layout positioning
4. Position components based on calculated coordinates

```javascript
function createLayout(components, width, height) {
  // Create root node
  const rootNode = yoga.Node.create();
  rootNode.setWidth(width);
  rootNode.setHeight(height);
  rootNode.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN);
  
  // Add child nodes for each component
  for (const component of components) {
    const node = component.createLayoutNode();
    rootNode.insertChild(node, rootNode.getChildCount());
  }
  
  // Calculate final layout
  rootNode.calculateLayout();
  
  // Apply calculated layout to components
  for (let i = 0; i < components.length; i++) {
    const layoutNode = rootNode.getChild(i);
    components[i].applyLayout(layoutNode);
  }
  
  return rootNode;
}
```

## Theming System

The terminal UI includes a comprehensive theming system:

- Base themes (light/dark)
- Color palette definitions
- Component-specific styling
- User customization options

```javascript
const themes = {
  light: {
    background: 255, // White
    foreground: 0,   // Black
    primary: 33,     // Blue
    secondary: 130,  // Green
    accent: 161,     // Purple
    error: 160,      // Red
    // Additional color definitions...
  },
  dark: {
    background: 0,   // Black
    foreground: 255, // White
    primary: 75,     // Light Blue
    secondary: 114,  // Light Green
    accent: 141,     // Light Purple
    error: 196,      // Bright Red
    // Additional color definitions...
  }
};
```

## Performance Optimizations

The terminal UI implements several optimizations:

1. **Partial Updates**: Only redraw changed components
2. **Double Buffering**: Prepare content before writing to terminal
3. **Throttling**: Limit update frequency for smooth rendering
4. **Lazy Rendering**: Only calculate layouts for visible elements
5. **Memoization**: Cache formatting and styling calculations

## Related Documentation

- [Rendering System](./rendering.md) - Details on the rendering pipeline
- [User Input Handling](./input.md) - In-depth coverage of input processing
- [WebAssembly Integration](../wasm/integration.md) - How WASM powers the UI