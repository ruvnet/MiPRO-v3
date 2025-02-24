# Claude Code CLI

A command-line interface for interacting with Claude AI.

## Installation

```bash
# Clone the repository
git clone https://github.com/anthropics/claude-code.git
cd claude-code

# Install dependencies
npm install

# Make the CLI executable
chmod +x cli.mjs

# Link the package globally (optional)
npm link
```

## Usage

```bash
# Show help
claude --help

# Show version
claude --version

# Start a conversation with Claude
claude

# Enable debug mode
claude --debug
```

## Project Structure

- `cli.mjs` - Main entry point
- `src/` - Source code
  - `index.mjs` - Main application initialization
  - `cli/` - CLI-related modules
    - `app.mjs` - Main application flow
    - `commands.mjs` - Command handlers
    - `parse-args.mjs` - Command-line argument parsing
  - `terminal/` - Terminal UI modules
    - `ui.mjs` - Terminal UI utilities
  - `api/` - API client modules
    - `client.mjs` - Claude API client
  - `git/` - Git integration modules
    - `git.mjs` - Git utilities
  - `config/`- Configuration modules
    - `constants.mjs` - Constants and configuration
    - `paths.mjs` - Path utilities
    - `env.mjs` - Environment variable loader
  - `auth/` - Authentication modules
    - `auth.mjs` - Authentication utilities
  - `wasm/` - WebAssembly UI modules
    - `index.mjs` - WASM UI entry point
    - `ui-components.mjs` - UI components
    - `layout-engine.mjs` - Layout engine
    - `terminal-renderer.mjs` - Terminal renderer
    - `yoga-loader.mjs` - Yoga WASM loader
    - `conversation-ui.mjs` - Conversation UI
  - `utils/` - Utility modules
    - `file.mjs` - File utilities
    - `search.mjs` - Search utilities

## Development

### Adding a new command

1. Add the command handler to `src/cli/commands.mjs`
2. Update the `COMMANDS` object with the new command
3. Implement the command handler function

### Adding a new UI component

1. Add the component class to `src/wasm/ui-components.mjs`
2. Extend the `UIComponent` class
3. Implement the required methods

## License

See LICENSE file for details.
