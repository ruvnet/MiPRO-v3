# Claude Code Development Guide

## Commands
- Build: `npm install` (Node.js 18+ required)
- Run: `node cli.mjs` or via binary `claude`
- Debug: `node --inspect cli.mjs` for debugging with DevTools

## Code Style
- TypeScript with strict typing (avoid `any` types)
- ES Modules format (`import`/`export` not `require`)
- Camel case for variables/functions, PascalCase for classes
- Async/await pattern for asynchronous operations
- Comprehensive error handling with descriptive messages
- Single quotes for strings, template literals for interpolation
- Functional programming where appropriate
- JSDoc comments for public APIs and complex functions
- Clean git commits with descriptive messages

## Project Structure
- CLI entry point: `cli.mjs`
- Uses Anthropic API via SDK in `vendor/sdk/`
- Cross-platform file operations with explicit error handling
- Ripgrep binary available in `vendor/ripgrep/` for search operations