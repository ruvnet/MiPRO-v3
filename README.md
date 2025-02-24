# Open Claude Code

![](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=flat-square)
![](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![](https://img.shields.io/badge/Status-Alpha-orange?style=flat-square)

Open Claude Code is an open-source implementation of the Claude Code CLI, bringing powerful AI-assisted coding capabilities to your terminal. It provides a local interface for interacting with Claude AI models to help you code faster, understand complex codebases, and complete routine development tasks efficiently.

## Introduction

Open Claude Code brings the power of Claude AI directly to your development workflow through a terminal interface. It allows you to:

- Get instant help with coding problems without leaving your terminal
- Implement a comprehensive terminal UI for AI interactions using WebAssembly
- Enjoy a rich development experience with advanced layout and rendering capabilities
- Interact with Claude AI in a seamless, intuitive way designed for developers

## Features

- **Terminal-based UI**: A sophisticated terminal interface built with WebAssembly for responsive interactions
- **Rich Text Rendering**: Support for syntax highlighting, formatting, and complex layouts
- **Robust Error Handling**: Multi-layered fallback mechanisms ensure the application works even when components fail
- **Conversation Context**: Maintains conversation history for contextual interactions with Claude
- **Command System**: Built-in commands for various functions like help, version info, and UI switching
- **Mock Implementation**: Reliable JavaScript mock implementation when WASM isn't available

## Core Capabilities

- **Interactive AI Coding Assistant**: Have natural language conversations with Claude AI about your code
- **Flexible WASM UI Framework**: Create rich terminal interfaces with a component-based architecture
- **Layout Engine**: Flexbox-inspired layout system for creating complex UI layouts in the terminal
- **Terminal Rendering**: Efficient cell-based rendering with support for colors and text styles
- **Event Handling**: Process keyboard and mouse events for interactive UI elements

## Usage Guide

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/open-claude-code.git
cd open-claude-code

# Install dependencies
npm install

# Build the project
npm run build

# Create a symlink for global access
npm link
```

### Getting Started

1. Run Open Claude Code in your terminal:
   ```bash
   claude-code
   ```

2. Use the following built-in commands:
   - `/help` - Display available commands and help information
   - `/version` - Show version information
   - `/ui` - Switch to the WebAssembly UI mode
   - `/ui conversation` - Start an interactive conversation UI
   - `/quit` - Exit the application

### Using the WASM UI

The WebAssembly UI offers two primary modes:

1. **Demo Mode**:
   ```bash
   /ui
   ```
   Displays a showcase of UI components and capabilities.

2. **Conversation Mode**:
   ```bash
   /ui conversation
   ```
   Provides an interactive chat interface for communicating with Claude.

### Environment Variables

- `CLAUDE_FORCE_WASM_FALLBACK=true` - Force the use of JavaScript fallbacks instead of WASM
- `DEBUG=claude:wasm*` - Enable debugging for WASM components
- `DEBUG=claude:wasm:mock*` - Debug the mock implementation specifically

## Architecture

Open Claude Code is built on a modular architecture:

```
┌───────────────────────────────────────┐
│             Terminal UI               │
├───────────────────────────────────────┤
│    Component System    │   Renderer   │
├───────────────────────┼───────────────┤
│    Layout Engine      │  Event System │
├───────────────────────┴───────────────┤
│           WASM / Mock Layer           │
└───────────────────────────────────────┘
```

The application features a comprehensive fallback system, ensuring graceful degradation when components fail or WASM is unavailable.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Anthropic's Claude Code CLI
- Built with Node.js and WebAssembly
- UI design based on modern flexbox principles
