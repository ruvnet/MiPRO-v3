/**
 * UI Components for the terminal interface
 * Built on top of the Yoga layout engine
 */

import { LayoutComponent, initLayoutEngine } from './layout-engine.mjs';

/**
 * Base UI component that can be rendered in the terminal
 */
export class UIComponent extends LayoutComponent {
  /**
   * Create a new UIComponent
   * @param {Object} options - Configuration options
   * @param {string} options.id - Component ID
   * @param {string} options.className - Component class name
   * @param {boolean} options.visible - Whether the component is visible
   */
  constructor(options = {}) {
    super(options);
    
    this.id = options.id || '';
    this.className = options.className || '';
    this.visible = options.visible !== undefined ? options.visible : true;
    this.content = options.content || '';
    this.style = options.style || {};
  }
  
  /**
   * Render the component to the terminal
   * @param {Object} ctx - Rendering context
   */
  render(ctx) {
    if (!this.visible) return;
    
    const layout = this.getComputedLayout();
    
    // Apply styles
    const styles = this.computeStyles();
    
    // Render background if specified
    if (styles.backgroundColor) {
      this.renderBackground(ctx, layout, styles);
    }
    
    // Render content
    this.renderContent(ctx, layout, styles);
    
    // Render children
    for (const child of this.children) {
      child.render(ctx);
    }
  }
  
  /**
   * Render the component's background
   * @param {Object} ctx - Rendering context
   * @param {Object} layout - Component layout
   * @param {Object} styles - Component styles
   */
  renderBackground(ctx, layout, styles) {
    // Fill background with spaces
    const bgColor = styles.backgroundColor || '';
    
    if (bgColor) {
      for (let y = 0; y < layout.height; y++) {
        for (let x = 0; x < layout.width; x++) {
          ctx.setCell(
            Math.floor(layout.left + x),
            Math.floor(layout.top + y),
            ' ',
            { backgroundColor: bgColor }
          );
        }
      }
    }
  }
  
  /**
   * Render the component's content
   * @param {Object} ctx - Rendering context
   * @param {Object} layout - Component layout
   * @param {Object} styles - Component styles
   */
  renderContent(ctx, layout, styles) {
    if (!this.content) return;
    
    // Calculate content position
    const contentX = Math.floor(layout.left);
    const contentY = Math.floor(layout.top);
    
    // Render the content
    ctx.drawText(
      contentX,
      contentY,
      this.content,
      {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        bold: styles.fontWeight === 'bold',
        italic: styles.fontStyle === 'italic',
        underline: styles.textDecoration === 'underline',
      }
    );
  }
  
  /**
   * Compute the component's styles
   * @returns {Object} The computed styles
   */
  computeStyles() {
    // Default styles
    const defaultStyles = {
      color: 'white',
      backgroundColor: 'transparent',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
    };
    
    // Merge with custom styles
    return { ...defaultStyles, ...this.style };
  }
  
  /**
   * Set the component's content
   * @param {string} content - The content to set
   * @returns {UIComponent} The component instance
   */
  setContent(content) {
    this.content = content;
    return this;
  }
  
  /**
   * Set the component's style
   * @param {Object} style - The style to set
   * @returns {UIComponent} The component instance
   */
  setStyle(style) {
    this.style = { ...this.style, ...style };
    return this;
  }
  
  /**
   * Show the component
   * @returns {UIComponent} The component instance
   */
  show() {
    this.visible = true;
    return this;
  }
  
  /**
   * Hide the component
   * @returns {UIComponent} The component instance
   */
  hide() {
    this.visible = false;
    return this;
  }
}

/**
 * Text component for displaying text
 */
export class Text extends UIComponent {
  /**
   * Create a new Text component
   * @param {Object} options - Configuration options
   * @param {string} options.text - The text to display
   */
  constructor(options = {}) {
    super(options);
    this.text = options.text || '';
    this.content = this.text;
  }
  
  /**
   * Set the text
   * @param {string} text - The text to set
   * @returns {Text} The component instance
   */
  setText(text) {
    this.text = text;
    this.content = text;
    return this;
  }
}

/**
 * Box component for creating containers
 */
export class Box extends UIComponent {
  /**
   * Create a new Box component
   * @param {Object} options - Configuration options
   * @param {boolean} options.border - Whether to show a border
   * @param {string} options.borderStyle - Border style
   */
  constructor(options = {}) {
    super(options);
    this.border = options.border !== undefined ? options.border : false;
    this.borderStyle = options.borderStyle || 'single';
  }
  
  /**
   * Render the component to the terminal
   * @param {Object} ctx - Rendering context
   */
  render(ctx) {
    super.render(ctx);
    
    // Render border if enabled
    if (this.border) {
      this.renderBorder(ctx);
    }
  }
  
  /**
   * Render the component's border
   * @param {Object} ctx - Rendering context
   */
  renderBorder(ctx) {
    const layout = this.getComputedLayout();
    const styles = this.computeStyles();
    
    const left = Math.floor(layout.left);
    const top = Math.floor(layout.top);
    const right = Math.floor(layout.left + layout.width - 1);
    const bottom = Math.floor(layout.top + layout.height - 1);
    
    // Border characters
    let chars;
    if (this.borderStyle === 'double') {
      chars = {
        topLeft: '╔',
        topRight: '╗',
        bottomLeft: '╚',
        bottomRight: '╝',
        horizontal: '═',
        vertical: '║',
      };
    } else {
      chars = {
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        horizontal: '─',
        vertical: '│',
      };
    }
    
    // Draw top border
    ctx.drawText(left, top, chars.topLeft, styles);
    for (let x = left + 1; x < right; x++) {
      ctx.drawText(x, top, chars.horizontal, styles);
    }
    ctx.drawText(right, top, chars.topRight, styles);
    
    // Draw bottom border
    ctx.drawText(left, bottom, chars.bottomLeft, styles);
    for (let x = left + 1; x < right; x++) {
      ctx.drawText(x, bottom, chars.horizontal, styles);
    }
    ctx.drawText(right, bottom, chars.bottomRight, styles);
    
    // Draw left and right borders
    for (let y = top + 1; y < bottom; y++) {
      ctx.drawText(left, y, chars.vertical, styles);
      ctx.drawText(right, y, chars.vertical, styles);
    }
  }
}

/**
 * Input component for user input
 */
export class Input extends UIComponent {
  /**
   * Create a new Input component
   * @param {Object} options - Configuration options
   * @param {string} options.placeholder - Placeholder text
   * @param {string} options.value - Initial value
   * @param {boolean} options.focus - Whether the input is focused
   */
  constructor(options = {}) {
    super(options);
    this.placeholder = options.placeholder || '';
    this.value = options.value || '';
    this.focus = options.focus !== undefined ? options.focus : false;
    this.cursorPos = this.value.length;
  }
  
  /**
   * Render the component content
   * @param {Object} ctx - Rendering context
   * @param {Object} layout - Component layout
   * @param {Object} styles - Component styles
   */
  renderContent(ctx, layout, styles) {
    const x = Math.floor(layout.left);
    const y = Math.floor(layout.top);
    
    // Display placeholder if no value and not focused
    if (!this.value && !this.focus && this.placeholder) {
      ctx.drawText(x, y, this.placeholder, {
        ...styles,
        color: styles.placeholderColor || 'gray',
      });
      return;
    }
    
    // Display value
    ctx.drawText(x, y, this.value, styles);
    
    // Display cursor if focused
    if (this.focus) {
      const cursorX = x + this.cursorPos;
      ctx.drawText(cursorX, y, '_', {
        ...styles,
        color: styles.cursorColor || styles.color,
        backgroundColor: styles.cursorBackgroundColor || styles.backgroundColor,
      });
    }
  }
  
  /**
   * Handle keyboard input
   * @param {Object} event - Keyboard event
   * @returns {boolean} Whether the event was handled
   */
  handleKeyboard(event) {
    if (!this.focus) return false;
    
    switch (event.key) {
      case 'ArrowLeft':
        this.cursorPos = Math.max(0, this.cursorPos - 1);
        return true;
      
      case 'ArrowRight':
        this.cursorPos = Math.min(this.value.length, this.cursorPos + 1);
        return true;
      
      case 'Home':
        this.cursorPos = 0;
        return true;
      
      case 'End':
        this.cursorPos = this.value.length;
        return true;
      
      case 'Backspace':
        if (this.cursorPos > 0) {
          this.value = this.value.slice(0, this.cursorPos - 1) + this.value.slice(this.cursorPos);
          this.cursorPos--;
        }
        return true;
      
      case 'Delete':
        if (this.cursorPos < this.value.length) {
          this.value = this.value.slice(0, this.cursorPos) + this.value.slice(this.cursorPos + 1);
        }
        return true;
      
      default:
        // Add character if it's a printable character
        if (event.key.length === 1) {
          this.value = this.value.slice(0, this.cursorPos) + event.key + this.value.slice(this.cursorPos);
          this.cursorPos++;
          return true;
        }
    }
    
    return false;
  }
  
  /**
   * Set focus on the input
   * @param {boolean} focus - Whether to focus the input
   * @returns {Input} The component instance
   */
  setFocus(focus) {
    this.focus = focus;
    if (focus) {
      this.cursorPos = this.value.length;
    }
    return this;
  }
}

/**
 * Button component for user interactions
 */
export class Button extends UIComponent {
  /**
   * Create a new Button component
   * @param {Object} options - Configuration options
   * @param {string} options.label - Button label
   * @param {Function} options.onClick - Click handler
   */
  constructor(options = {}) {
    super(options);
    this.label = options.label || 'Button';
    this.onClick = options.onClick || (() => {});
    this.content = this.label;
    this.hover = false;
    this.active = false;
  }
  
  /**
   * Render the component to the terminal
   * @param {Object} ctx - Rendering context
   */
  render(ctx) {
    // Apply button-specific styles
    const buttonStyles = {
      backgroundColor: this.hover ? '#555' : '#333',
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    };
    
    if (this.active) {
      buttonStyles.backgroundColor = '#222';
    }
    
    this.style = { ...this.style, ...buttonStyles };
    
    // Render the button
    super.render(ctx);
  }
  
  /**
   * Handle mouse events
   * @param {Object} event - Mouse event
   * @returns {boolean} Whether the event was handled
   */
  handleMouse(event) {
    const layout = this.getComputedLayout();
    
    // Check if the mouse is over the button
    const isOver = (
      event.x >= layout.left &&
      event.x < layout.left + layout.width &&
      event.y >= layout.top &&
      event.y < layout.top + layout.height
    );
    
    // Update hover state
    if (isOver !== this.hover) {
      this.hover = isOver;
      return true;
    }
    
    // Handle click
    if (isOver && event.type === 'mousedown') {
      this.active = true;
      return true;
    } else if (this.active && event.type === 'mouseup') {
      this.active = false;
      if (isOver) {
        this.onClick();
      }
      return true;
    }
    
    return false;
  }
}

/**
 * Progress bar component
 */
export class ProgressBar extends UIComponent {
  /**
   * Create a new ProgressBar component
   * @param {Object} options - Configuration options
   * @param {number} options.value - Current value (0-100)
   * @param {boolean} options.showLabel - Whether to show percentage label
   */
  constructor(options = {}) {
    super(options);
    this.value = Math.min(100, Math.max(0, options.value || 0));
    this.showLabel = options.showLabel !== undefined ? options.showLabel : true;
  }
  
  /**
   * Render the component content
   * @param {Object} ctx - Rendering context
   * @param {Object} layout - Component layout
   * @param {Object} styles - Component styles
   */
  renderContent(ctx, layout, styles) {
    const width = Math.floor(layout.width);
    const x = Math.floor(layout.left);
    const y = Math.floor(layout.top);
    
    // Calculate filled width
    const filledWidth = Math.floor((width * this.value) / 100);
    
    // Draw progress bar background
    for (let i = 0; i < width; i++) {
      const isFilled = i < filledWidth;
      ctx.drawText(x + i, y, ' ', {
        backgroundColor: isFilled ? (styles.fillColor || 'green') : (styles.backgroundColor || 'gray'),
      });
    }
    
    // Draw label if enabled
    if (this.showLabel && width > 5) {
      const label = `${Math.round(this.value)}%`;
      const labelX = x + Math.floor((width - label.length) / 2);
      ctx.drawText(labelX, y, label, {
        color: styles.labelColor || 'white',
        backgroundColor: 'transparent',
      });
    }
  }
  
  /**
   * Set the progress value
   * @param {number} value - The value to set (0-100)
   * @returns {ProgressBar} The component instance
   */
  setValue(value) {
    this.value = Math.min(100, Math.max(0, value));
    return this;
  }
}

/**
 * Create a complete UI system
 * @param {Object} terminalSize - Terminal size
 * @returns {Object} The UI system
 */
export async function createUI(terminalSize) {
  try {
    // Initialize yoga
    const yoga = await initLayoutEngine();
    
    // Keep track of all components
    const components = new Map();
    
    // Create renderer context
    const renderingContext = {
      setCell(x, y, char, styles = {}) {
        // Implementation will be provided by the terminal UI system
        // Silently fail instead of logging to avoid console spam
      },
      
      drawText(x, y, text, styles = {}) {
        // Implementation will be provided by the terminal UI system
        // Silently fail instead of logging to avoid console spam
      },
    };
    
    // Create root component
    const root = new Box({
      width: terminalSize.width,
      height: terminalSize.height,
      flexDirection: 'column',
    });
    
    root.init(yoga);
    components.set('root', root);
  
  return {
    root,
    yoga,
    renderingContext,
    
    /**
     * Create a UI component
     * @param {string} type - Component type
     * @param {Object} options - Component options
     * @returns {UIComponent} The created component
     */
    createComponent(type, options = {}) {
      let component;
      
      // Create component based on type
      switch (type.toLowerCase()) {
        case 'text':
          component = new Text(options);
          break;
        case 'box':
          component = new Box(options);
          break;
        case 'input':
          component = new Input(options);
          break;
        case 'button':
          component = new Button(options);
          break;
        case 'progressbar':
          component = new ProgressBar(options);
          break;
        default:
          component = new UIComponent(options);
      }
      
      // Initialize with yoga
      component.init(yoga);
      
      // Add to components map if ID is provided
      if (options.id) {
        components.set(options.id, component);
      }
      
      return component;
    },
    
    /**
     * Get a component by ID
     * @param {string} id - Component ID
     * @returns {UIComponent|undefined} The component, or undefined if not found
     */
    getComponent(id) {
      return components.get(id);
    },
    
    /**
     * Render the UI
     */
    render() {
      root.calculateLayout();
      root.render(renderingContext);
    },
    
    /**
     * Handle keyboard input
     * @param {Object} event - Keyboard event
     */
    handleKeyboard(event) {
      // Find input components and pass the event
      for (const component of components.values()) {
        if (component instanceof Input && component.handleKeyboard(event)) {
          this.render();
          break;
        }
      }
    },
    
    /**
     * Handle mouse input
     * @param {Object} event - Mouse event
     */
    handleMouse(event) {
      // Find button components and pass the event
      for (const component of components.values()) {
        if (component instanceof Button && component.handleMouse(event)) {
          this.render();
          break;
        }
      }
    },
    
    /**
     * Clean up resources
     */
    cleanup() {
      for (const component of components.values()) {
        component.cleanup();
      }
      components.clear();
    },
  };
  } catch (error) {
    console.error('Error creating UI system:', error);
    // Return a minimal UI system that won't crash
    return createMinimalUISystem(terminalSize);
  }
}

/**
 * Create a minimal UI system that won't crash
 * @param {Object} terminalSize - Terminal size
 * @returns {Object} A minimal UI system
 */
function createMinimalUISystem(terminalSize) {
  return {
    root: {
      addChild: () => {},
      calculateLayout: () => {},
      render: () => {},
      setWidth: () => {},
      setHeight: () => {},
    },
    yoga: null,
    renderingContext: {
      setCell: () => {},
      drawText: () => {},
    },
    createComponent: () => ({
      addChild: () => ({}),
      init: () => ({}),
    }),
    getComponent: () => null,
    render: () => {},
    handleKeyboard: () => {},
    handleMouse: () => {},
    cleanup: () => {},
  };
}