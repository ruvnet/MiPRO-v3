/**
 * Layout engine for terminal UI
 * Uses Yoga WebAssembly module for flexbox layout
 */

import { loadYoga } from './yoga-loader.mjs';

// Global yoga instance
let yogaInstance = null;

/**
 * Initialize the layout engine
 * Loads the WASM module if not already loaded
 * @returns {Promise<void>}
 */
export async function initLayoutEngine() {
  if (!yogaInstance) {
    try {
      yogaInstance = await loadYoga();
    } catch (error) {
      console.error('Failed to load Yoga:', error);
      // Provide a fallback implementation that won't crash
      yogaInstance = createFallbackYoga();
    }
  }
  return yogaInstance;
}

/**
 * Create a fallback yoga implementation that won't crash
 * @returns {Object} Fallback yoga implementation
 */
function createFallbackYoga() {
  return {
    Node: {
      create: () => ({
        setWidth: () => ({}),
        setHeight: () => ({}),
        setFlexDirection: () => ({}),
        setJustifyContent: () => ({}),
        setAlignItems: () => ({}),
        addChild: () => ({}),
        calculateLayout: () => ({}),
        getComputedLeft: () => 0,
        getComputedTop: () => 0,
        getComputedWidth: () => 100,
        getComputedHeight: () => 100,
        free: () => ({})
      })
    },
    FLEX_DIRECTION_ROW: 1,
    FLEX_DIRECTION_COLUMN: 0,
    JUSTIFY_CENTER: 1,
    JUSTIFY_FLEX_START: 0,
    JUSTIFY_FLEX_END: 2,
    JUSTIFY_SPACE_BETWEEN: 3,
    JUSTIFY_SPACE_AROUND: 4,
    ALIGN_CENTER: 2,
    ALIGN_FLEX_START: 1,
    ALIGN_FLEX_END: 3,
    ALIGN_STRETCH: 4
  };
}

/**
 * A UI component with layout capabilities
 */
export class LayoutComponent {
  /**
   * Create a new LayoutComponent
   * @param {Object} options - Configuration options
   * @param {number} options.width - Width of the component
   * @param {number} options.height - Height of the component
   * @param {number} options.x - X position of the component
   * @param {number} options.y - Y position of the component
   * @param {string} options.flexDirection - Flex direction (row, column)
   * @param {string} options.justifyContent - Justify content
   * @param {string} options.alignItems - Align items
   */
  constructor(options = {}) {
    this.options = {
      width: options.width || 100,
      height: options.height || 100,
      x: options.x || 0,
      y: options.y || 0,
      flexDirection: options.flexDirection || 'column',
      justifyContent: options.justifyContent || 'flex-start',
      alignItems: options.alignItems || 'stretch',
    };
    
    this.children = [];
    this.node = null;
    this.parent = null;
  }
  
  /**
   * Initialize the component with Yoga
   * @param {Object} yoga - The Yoga instance
   * @returns {LayoutComponent} The component instance
   */
  init(yoga) {
    // Create a Yoga node
    this.node = yoga.Node.create();
    
    // Set width and height
    if (this.options.width !== undefined) {
      this.node.setWidth(this.options.width);
    }
    
    if (this.options.height !== undefined) {
      this.node.setHeight(this.options.height);
    }
    
    // Set flex direction
    if (this.options.flexDirection === 'row') {
      this.node.setFlexDirection(yoga.FLEX_DIRECTION_ROW);
    } else {
      this.node.setFlexDirection(yoga.FLEX_DIRECTION_COLUMN);
    }
    
    // Set justify content
    switch (this.options.justifyContent) {
      case 'center':
        this.node.setJustifyContent(yoga.JUSTIFY_CENTER);
        break;
      case 'flex-end':
        this.node.setJustifyContent(yoga.JUSTIFY_FLEX_END);
        break;
      case 'space-between':
        this.node.setJustifyContent(yoga.JUSTIFY_SPACE_BETWEEN);
        break;
      case 'space-around':
        this.node.setJustifyContent(yoga.JUSTIFY_SPACE_AROUND);
        break;
      default:
        this.node.setJustifyContent(yoga.JUSTIFY_FLEX_START);
    }
    
    // Set align items
    switch (this.options.alignItems) {
      case 'center':
        this.node.setAlignItems(yoga.ALIGN_CENTER);
        break;
      case 'flex-end':
        this.node.setAlignItems(yoga.ALIGN_FLEX_END);
        break;
      case 'stretch':
        this.node.setAlignItems(yoga.ALIGN_STRETCH);
        break;
      default:
        this.node.setAlignItems(yoga.ALIGN_FLEX_START);
    }
    
    return this;
  }
  
  /**
   * Add a child component
   * @param {LayoutComponent} child - The child component to add
   * @returns {LayoutComponent} The component instance
   */
  addChild(child) {
    this.children.push(child);
    child.parent = this;
    
    if (this.node && child.node) {
      this.node.addChild(child.node);
    }
    
    return this;
  }
  
  /**
   * Calculate the layout for this component and its children
   * @returns {LayoutComponent} The component instance
   */
  calculateLayout() {
    if (this.node) {
      this.node.calculateLayout();
    }
    return this;
  }
  
  /**
   * Get the computed layout values
   * @returns {Object} The computed layout
   */
  getComputedLayout() {
    if (!this.node) {
      return {
        left: this.options.x,
        top: this.options.y,
        width: this.options.width,
        height: this.options.height,
      };
    }
    
    return {
      left: this.node.getComputedLeft() + (this.parent ? this.parent.getComputedLayout().left : 0),
      top: this.node.getComputedTop() + (this.parent ? this.parent.getComputedLayout().top : 0),
      width: this.node.getComputedWidth(),
      height: this.node.getComputedHeight(),
    };
  }
  
  /**
   * Clean up resources
   */
  cleanup() {
    // Clean up children first
    for (const child of this.children) {
      child.cleanup();
    }
    
    // Free Yoga node
    if (this.node) {
      this.node.free();
      this.node = null;
    }
  }
}

/**
 * Create a root layout component
 * @param {Object} terminalSize - Terminal size
 * @param {number} terminalSize.width - Terminal width
 * @param {number} terminalSize.height - Terminal height
 * @returns {Promise<LayoutComponent>} The root component
 */
export async function createRootLayout(terminalSize) {
  const yoga = await initLayoutEngine();
  
  const root = new LayoutComponent({
    width: terminalSize.width,
    height: terminalSize.height,
    flexDirection: 'column',
  });
  
  root.init(yoga);
  return root;
}