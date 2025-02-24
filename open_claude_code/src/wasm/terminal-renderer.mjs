/**
 * Terminal renderer for WASM UI
 * Handles rendering UI components to the terminal
 */

import readline from 'readline';
import { stdout, stdin } from 'process';
import { createUI } from './ui-components.mjs';

// ANSI color escape codes
const COLORS = {
  reset: '\x1b[0m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bgGray: '\x1b[100m',
  bgBrightRed: '\x1b[101m',
  bgBrightGreen: '\x1b[102m',
  bgBrightYellow: '\x1b[103m',
  bgBrightBlue: '\x1b[104m',
  bgBrightMagenta: '\x1b[105m',
  bgBrightCyan: '\x1b[106m',
  bgBrightWhite: '\x1b[107m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  blink: '\x1b[5m',
  inverse: '\x1b[7m',
  hidden: '\x1b[8m',
  strikethrough: '\x1b[9m',
};

/**
 * Terminal renderer class
 */
export class TerminalRenderer {
  constructor() {
    this.ui = null;
    this.buffer = [];
    this.terminalWidth = stdout.columns || 80;
    this.terminalHeight = stdout.rows || 24;
    this.isRenderPending = false;
    this.isRawModeEnabled = false;
    this.mouseHandling = false;
    
    // Track event listeners to clean them up
    this.resizeListener = this.handleResize.bind(this);
    this.keyPressListener = this.handleKeyPress.bind(this);
    this.mouseListener = this.handleMouse.bind(this);
    
    // Initialize buffer
    this.initBuffer();
  }
  
  /**
   * Initialize the renderer
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      // Create UI system
      this.ui = await createUI({
        width: this.terminalWidth,
        height: this.terminalHeight,
      });
      
      // Override the rendering context methods
      this.ui.renderingContext = {
        setCell: this.setCell.bind(this),
        drawText: this.drawText.bind(this),
      };
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Hide cursor and enable mouse events
      this.setupTerminal();
    } catch (error) {
      console.error('Error initializing renderer:', error);
      // Create a minimal UI object that won't crash the app
      this.ui = this.createMinimalUI();
    }
    
    return this;
  }
  
  /**
   * Create a minimal UI object that won't crash
   * @returns {Object} A minimal UI object
   */
  createMinimalUI() {
    return {
      root: {
        addChild: () => {},
        setWidth: () => {},
        setHeight: () => {},
      },
      renderingContext: {
        setCell: this.setCell.bind(this),
        drawText: this.drawText.bind(this),
      },
      createComponent: () => ({
        addChild: () => {},
        setWidth: () => {},
        setHeight: () => {},
      }),
      getComponent: () => null,
      render: () => {},
      handleKeyboard: () => {},
      handleMouse: () => {},
      cleanup: () => {},
    };
  }
  
  /**
   * Initialize the buffer with empty cells
   */
  initBuffer() {
    this.buffer = [];
    
    for (let y = 0; y < this.terminalHeight; y++) {
      const row = [];
      for (let x = 0; x < this.terminalWidth; x++) {
        row.push({
          char: ' ',
          dirty: true,
          styles: {},
        });
      }
      this.buffer.push(row);
    }
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Handle terminal resize
    stdout.on('resize', this.resizeListener);
    
    // Handle keyboard input
    stdin.on('keypress', this.keyPressListener);
    
    // Handle mouse events if enabled
    if (this.mouseHandling) {
      stdout.write('\x1b[?1000h'); // Enable mouse tracking
      stdout.write('\x1b[?1002h'); // Enable mouse motion events
      stdout.write('\x1b[?1015h'); // Enable urxvt mouse mode
      stdout.write('\x1b[?1006h'); // Enable SGR mouse mode
      
      stdin.on('data', this.mouseListener);
    }
  }
  
  /**
   * Clean up event listeners
   */
  cleanupEventListeners() {
    stdout.removeListener('resize', this.resizeListener);
    stdin.removeListener('keypress', this.keyPressListener);
    
    if (this.mouseHandling) {
      stdout.write('\x1b[?1000l'); // Disable mouse tracking
      stdout.write('\x1b[?1002l'); // Disable mouse motion events
      stdout.write('\x1b[?1015l'); // Disable urxvt mouse mode
      stdout.write('\x1b[?1006l'); // Disable SGR mouse mode
      
      stdin.removeListener('data', this.mouseListener);
    }
  }
  
  /**
   * Setup terminal for rendering
   */
  setupTerminal() {
    // Hide cursor
    stdout.write('\x1b[?25l');
    
    // Clear screen
    stdout.write('\x1b[2J');
    
    // Move cursor to top-left
    stdout.write('\x1b[H');
    
    // Enable raw mode for keyboard input
    if (stdin.isTTY && !this.isRawModeEnabled) {
      stdin.setRawMode(true);
      this.isRawModeEnabled = true;
      readline.emitKeypressEvents(stdin);
    }
  }
  
  /**
   * Restore terminal to normal state
   */
  restoreTerminal() {
    // Show cursor
    stdout.write('\x1b[?25h');
    
    // Disable raw mode
    if (stdin.isTTY && this.isRawModeEnabled) {
      stdin.setRawMode(false);
      this.isRawModeEnabled = false;
    }
    
    // Clear screen
    stdout.write('\x1b[2J');
    
    // Move cursor to top-left
    stdout.write('\x1b[H');
  }
  
  /**
   * Handle terminal resize
   */
  handleResize() {
    this.terminalWidth = stdout.columns || 80;
    this.terminalHeight = stdout.rows || 24;
    
    // Resize buffer
    this.initBuffer();
    
    // Update UI root size
    if (this.ui && this.ui.root) {
      this.ui.root.setWidth(this.terminalWidth);
      this.ui.root.setHeight(this.terminalHeight);
    }
    
    // Request render
    this.requestRender();
  }
  
  /**
   * Handle keyboard events
   * @param {string} str - The character string
   * @param {Object} key - The key event
   */
  handleKeyPress(str, key) {
    // Handle exit (Ctrl+C or Ctrl+D)
    if ((key && key.ctrl && key.name === 'c') || 
        (key && key.ctrl && key.name === 'd')) {
      this.cleanup();
      process.exit(0);
    }
    
    // Pass event to UI
    if (this.ui) {
      this.ui.handleKeyboard(key);
    }
  }
  
  /**
   * Handle mouse events
   * @param {Buffer} data - The raw mouse event data
   */
  handleMouse(data) {
    const str = data.toString();
    
    // Parse SGR mouse events
    const match = str.match(/\x1b\[<(\d+);(\d+);(\d+)([mM])/);
    if (match) {
      const buttonAndState = parseInt(match[1], 10);
      const x = parseInt(match[2], 10) - 1;
      const y = parseInt(match[3], 10) - 1;
      const released = match[4] === 'M';
      
      const event = {
        x,
        y,
        type: released ? 'mouseup' : 'mousedown',
        button: buttonAndState & 3, // 0 = left, 1 = middle, 2 = right
        shift: !!(buttonAndState & 4),
        meta: !!(buttonAndState & 8),
        ctrl: !!(buttonAndState & 16),
      };
      
      // Pass event to UI
      if (this.ui) {
        this.ui.handleMouse(event);
      }
    }
  }
  
  /**
   * Set a cell in the buffer
   * @param {number} x - The x coordinate
   * @param {number} y - The y coordinate
   * @param {string} char - The character to set
   * @param {Object} styles - The styles to apply
   */
  setCell(x, y, char, styles = {}) {
    // Bounds check
    if (x < 0 || x >= this.terminalWidth || y < 0 || y >= this.terminalHeight) {
      return;
    }
    
    const cell = this.buffer[y][x];
    
    // Only update if something changed
    if (cell.char !== char || JSON.stringify(cell.styles) !== JSON.stringify(styles)) {
      cell.char = char;
      cell.styles = styles;
      cell.dirty = true;
      
      // Request render
      this.requestRender();
    }
  }
  
  /**
   * Draw text at a position
   * @param {number} x - The x coordinate
   * @param {number} y - The y coordinate
   * @param {string} text - The text to draw
   * @param {Object} styles - The styles to apply
   */
  drawText(x, y, text, styles = {}) {
    for (let i = 0; i < text.length; i++) {
      this.setCell(x + i, y, text[i], styles);
    }
  }
  
  /**
   * Request a render on next tick
   */
  requestRender() {
    if (!this.isRenderPending) {
      this.isRenderPending = true;
      process.nextTick(() => {
        this.render();
        this.isRenderPending = false;
      });
    }
  }
  
  /**
   * Render the UI
   */
  render() {
    if (!this.ui) return;
    
    // Calculate layout and render UI
    this.ui.render();
    
    // Render buffer to terminal
    this.flushBuffer();
  }
  
  /**
   * Flush the buffer to the terminal
   */
  flushBuffer() {
    // Build the output string
    let output = '';
    let lastStyles = {};
    
    for (let y = 0; y < this.terminalHeight; y++) {
      for (let x = 0; x < this.terminalWidth; x++) {
        const cell = this.buffer[y][x];
        
        if (cell.dirty) {
          // Position cursor
          output += `\x1b[${y + 1};${x + 1}H`;
          
          // Apply styles
          const stylesDiff = this.getStylesDiff(lastStyles, cell.styles);
          output += stylesDiff;
          
          // Draw character
          output += cell.char;
          
          // Update last styles
          lastStyles = { ...cell.styles };
          
          // Mark cell as clean
          cell.dirty = false;
        }
      }
    }
    
    // Reset styles
    output += COLORS.reset;
    
    // Write to terminal
    if (output) {
      stdout.write(output);
    }
  }
  
  /**
   * Get style differences between two style objects
   * @param {Object} oldStyles - The old styles
   * @param {Object} newStyles - The new styles
   * @returns {string} The style escape sequences
   */
  getStylesDiff(oldStyles, newStyles) {
    let output = '';
    
    // Reset if colors change
    if (oldStyles.color !== newStyles.color || 
        oldStyles.backgroundColor !== newStyles.backgroundColor) {
      output += COLORS.reset;
      
      // Apply foreground color
      if (newStyles.color) {
        output += this.getColorCode(newStyles.color, false);
      }
      
      // Apply background color
      if (newStyles.backgroundColor && newStyles.backgroundColor !== 'transparent') {
        output += this.getColorCode(newStyles.backgroundColor, true);
      }
    }
    
    // Apply text styles
    if (newStyles.bold && oldStyles.bold !== newStyles.bold) {
      output += COLORS.bold;
    }
    
    if (newStyles.italic && oldStyles.italic !== newStyles.italic) {
      output += COLORS.italic;
    }
    
    if (newStyles.underline && oldStyles.underline !== newStyles.underline) {
      output += COLORS.underline;
    }
    
    if (newStyles.dim && oldStyles.dim !== newStyles.dim) {
      output += COLORS.dim;
    }
    
    return output;
  }
  
  /**
   * Get the ANSI color code for a color
   * @param {string} color - The color name or hex code
   * @param {boolean} isBackground - Whether this is a background color
   * @returns {string} The color escape sequence
   */
  getColorCode(color, isBackground) {
    // Handle named colors
    const prefix = isBackground ? 'bg' : '';
    const colorName = prefix + color.charAt(0).toUpperCase() + color.slice(1);
    
    if (COLORS[colorName]) {
      return COLORS[colorName];
    }
    
    // Handle hex colors (basic approximation)
    if (color.startsWith('#')) {
      // Extract RGB components
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      // Use 256-color mode
      const ansi = isBackground ? '48;5;' : '38;5;';
      
      // Basic mapping to 256-color palette
      // This is a rough approximation
      if (r === g && g === b) {
        // Grayscale
        const gray = Math.round((r / 255) * 24) + 232;
        return `\x1b[${ansi}${gray}m`;
      } else {
        // RGB color
        const red = Math.round((r / 255) * 5);
        const green = Math.round((g / 255) * 5);
        const blue = Math.round((b / 255) * 5);
        const index = 16 + (red * 36) + (green * 6) + blue;
        return `\x1b[${ansi}${index}m`;
      }
    }
    
    // Default
    return isBackground ? COLORS.bgBlack : COLORS.white;
  }
  
  /**
   * Create a UI component
   * @param {string} type - Component type
   * @param {Object} options - Component options
   * @returns {Object} The created component
   */
  createComponent(type, options = {}) {
    if (!this.ui) return null;
    return this.ui.createComponent(type, options);
  }
  
  /**
   * Get a component by ID
   * @param {string} id - Component ID
   * @returns {Object|undefined} The component, or undefined if not found
   */
  getComponent(id) {
    if (!this.ui) return undefined;
    return this.ui.getComponent(id);
  }
  
  /**
   * Clean up resources
   */
  cleanup() {
    // Clean up UI
    if (this.ui) {
      this.ui.cleanup();
      this.ui = null;
    }
    
    // Restore terminal
    this.restoreTerminal();
    
    // Clean up event listeners
    this.cleanupEventListeners();
  }
}

/**
 * Create a new terminal renderer
 * @returns {Promise<TerminalRenderer>} The renderer instance
 */
export async function createRenderer() {
  const renderer = new TerminalRenderer();
  await renderer.initialize();
  return renderer;
}