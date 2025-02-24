#!/usr/bin/env node

/**
 * Test script for WASM UI
 * This script runs tests on the WASM UI components
 */

import { loadYoga } from './yoga-loader.mjs';
import { LayoutComponent, createRootLayout } from './layout-engine.mjs';
import { UIComponent, Box, Text, Input, Button, ProgressBar } from './ui-components.mjs';

/**
 * Test the yoga loader
 */
async function testYogaLoader() {
  console.log('\nTesting Yoga Loader...');
  
  try {
    const yoga = await loadYoga();
    console.log('✅ Yoga loaded successfully');
    
    // Test creating a node
    const node = yoga.Node.create();
    console.log('✅ Created Yoga node');
    
    // Test setting properties
    node.setWidth(100);
    node.setHeight(100);
    console.log('✅ Set node properties');
    
    // Test calculating layout
    node.calculateLayout();
    console.log('✅ Calculated layout');
    
    // Test getting computed values
    const width = node.getComputedWidth();
    const height = node.getComputedHeight();
    console.log(`✅ Got computed values: width=${width}, height=${height}`);
    
    // Test cleanup
    node.free();
    console.log('✅ Freed node resources');
    
  } catch (error) {
    console.error('❌ Yoga loader test failed:', error);
    throw error;
  }
}

/**
 * Test the layout engine
 */
async function testLayoutEngine() {
  console.log('\nTesting Layout Engine...');
  
  try {
    // Create a root layout
    const root = await createRootLayout({ width: 80, height: 24 });
    console.log('✅ Created root layout');
    
    // Create child components
    const child1 = new LayoutComponent({
      width: 40,
      height: 10,
    });
    
    const child2 = new LayoutComponent({
      width: 40,
      height: 10,
    });
    
    // Initialize with Yoga
    const yoga = await loadYoga();
    child1.init(yoga);
    child2.init(yoga);
    
    // Add children
    root.addChild(child1);
    root.addChild(child2);
    console.log('✅ Added child components');
    
    // Calculate layout
    root.calculateLayout();
    console.log('✅ Calculated layout');
    
    // Get computed layouts
    const rootLayout = root.getComputedLayout();
    const child1Layout = child1.getComputedLayout();
    const child2Layout = child2.getComputedLayout();
    
    console.log(`✅ Root layout: ${JSON.stringify(rootLayout)}`);
    console.log(`✅ Child 1 layout: ${JSON.stringify(child1Layout)}`);
    console.log(`✅ Child 2 layout: ${JSON.stringify(child2Layout)}`);
    
    // Cleanup
    root.cleanup();
    console.log('✅ Cleaned up resources');
    
  } catch (error) {
    console.error('❌ Layout engine test failed:', error);
    throw error;
  }
}

/**
 * Test UI components
 */
async function testUIComponents() {
  console.log('\nTesting UI Components...');
  
  try {
    // Create mock rendering context
    const mockContext = {
      setCell: (x, y, char, styles) => {
        // console.log(`Set cell at (${x},${y}): "${char}" with styles:`, styles);
      },
      drawText: (x, y, text, styles) => {
        // console.log(`Draw text at (${x},${y}): "${text}" with styles:`, styles);
      },
    };
    
    // Create components
    const yoga = await loadYoga();
    
    // Test UIComponent
    const component = new UIComponent({
      width: 10,
      height: 5,
      content: 'Test',
    });
    component.init(yoga);
    component.render(mockContext);
    console.log('✅ Rendered UIComponent');
    
    // Test Box
    const box = new Box({
      width: 20,
      height: 10,
      border: true,
    });
    box.init(yoga);
    box.render(mockContext);
    console.log('✅ Rendered Box');
    
    // Test Text
    const text = new Text({
      text: 'Hello, World!',
    });
    text.init(yoga);
    text.render(mockContext);
    console.log('✅ Rendered Text');
    
    // Test Input
    const input = new Input({
      placeholder: 'Type here...',
      value: 'Test input',
    });
    input.init(yoga);
    input.render(mockContext);
    console.log('✅ Rendered Input');
    
    // Test Button
    const button = new Button({
      label: 'Click Me',
    });
    button.init(yoga);
    button.render(mockContext);
    console.log('✅ Rendered Button');
    
    // Test ProgressBar
    const progressBar = new ProgressBar({
      value: 50,
    });
    progressBar.init(yoga);
    progressBar.render(mockContext);
    console.log('✅ Rendered ProgressBar');
    
    // Test component nesting
    box.addChild(text);
    box.addChild(input);
    box.render(mockContext);
    console.log('✅ Rendered nested components');
    
    // Test cleanup
    component.cleanup();
    box.cleanup();
    console.log('✅ Cleaned up component resources');
    
  } catch (error) {
    console.error('❌ UI components test failed:', error);
    throw error;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting WASM UI tests...');
  
  try {
    // Run tests
    await testYogaLoader();
    await testLayoutEngine();
    await testUIComponents();
    
    // All tests passed
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Tests failed:', error);
    process.exit(1);
  }
}

// Run tests
runTests();