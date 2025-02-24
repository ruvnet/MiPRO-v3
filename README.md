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
git clone https://github.com/ruvnet/open-claude-code.git
cd open-claude-code

# Install dependencies
node cli.mjs

# Create a symlink for global access
npm link
```

### Getting Started

1. Run Open Claude Code in your terminal:
   ```bash
   claude
   ```

## User Guide

This section provides detailed instructions on how to make the most of Open Claude Pro:

- **Starting an Interactive Session**: Launch the CLI by running `claude` in your terminal. This opens an interactive environment where you can type queries and commands.
- **Common Commands**: 
  - Use `claude` to start your session.
  - Run `claude commit` to create a commit.
  - Execute commands like `claude "fix the type errors in the auth module"` to automatically address issues.
- **Slash Commands**: Within the interactive session, use slash commands (e.g., `/bug`, `/clear`, `/config`) for reporting bugs, clearing history, and modifying settings.
- **Navigating the Interface**: Utilize your terminal's navigation keys to scroll through session history and review past outputs.
- **Advanced Features**: Benefit from automated Git operations, in-depth code analysis, and custom configurations via commands like `claude config`.

Report bugs directly with the /bug command or through our GitHub repository.

## Before you begin

### Check system requirements

| Component | Requirements |
|-----------|-------------|
| Operating Systems | macOS 10.15+, Ubuntu 20.04+/Debian 10+, or Windows via WSL |
| Hardware | 4GB RAM minimum |
| Software | Node.js 18+<br>git 2.23+ (optional)<br>GitHub or GitLab CLI for PR workflows (optional)<br>ripgrep (rg) for enhanced file search (optional) |
| Network | Internet connection required for authentication and AI processing |

### Install and authenticate

| Step | Action | Details |
|------|--------|---------|
| 1 | Install Claude Code | Run in your terminal: `npm install -g @anthropic-ai/claude-code` |
| 2 | Navigate to your project | `cd your-project-directory` |
| 3 | Start Claude Code | Run `claude` to launch |
| 4 | Complete authentication | Follow the one-time OAuth process with your Console account. You'll need active billing at console.anthropic.com. |

## Core features and workflows

Claude Code operates directly in your terminal, understanding your project context and taking real actions. No need to manually add files to context - Claude will explore your codebase as needed. Claude Code uses claude-3-7-sonnet-20250219 by default.

## Security and privacy by design

Your code's security is paramount. Claude Code's architecture ensures:

| Feature | Description |
|---------|-------------|
| Direct API connection | Your queries go straight to Anthropic's API without intermediate servers |
| Works where you work | Operates directly in your terminal |
| Understands context | Maintains awareness of your entire project structure |
| Takes action | Performs real operations like editing files and creating commits |

## From questions to solutions in seconds

```bash
# Ask questions about your codebase
$ claude
> how does our authentication system work?

# Create a commit with one command
$ claude commit

# Fix issues across multiple files
$ claude "fix the type errors in the auth module"
```

## Initialize your project

For first-time users, we recommend:

1. Start Claude Code with `claude`
2. Try a simple command like `summarize this project`
3. Generate a CLAUDE.md project guide with `/init`
4. Ask Claude to commit the generated CLAUDE.md file to your repository

## Use Claude Code for common tasks

Claude Code operates directly in your terminal, understanding your project context and taking real actions. No need to manually add files to context - Claude will explore your codebase as needed.

### Understand unfamiliar code

```
> what does the payment processing system do?
> find where user permissions are checked
> explain how the caching layer works
```

### Automate Git operations

```
> commit my changes
> create a pr
> which commit added tests for markdown back in December?
> rebase on main and resolve any merge conflicts
```

### Edit code intelligently

```
> add input validation to the signup form
> refactor the logger to use the new API
> fix the race condition in the worker queue
```

### Test and debug your code

```
> run tests for the auth module and fix failures
> find and fix security vulnerabilities
> explain why this test is failing
```

### Encourage deeper thinking

For complex problems, explicitly ask Claude to think more deeply:

```
> think about how we should architect the new payment service
> think hard about the edge cases in our authentication flow
```

## Control Claude Code with commands

### CLI commands

| Command | Description | Example |
|---------|-------------|---------|
| claude | Start interactive REPL | `$ claude` |
| claude "query" | Start REPL with initial prompt | `$ claude "explain this project"` |
| claude -p "query" | Run one-off query, then exit | `$ claude -p "explain this function"` |
| cat file \| claude -p "query" | Process piped content | `$ cat logs.txt \| claude -p "explain"` |
| claude config | Configure settings | `$ claude config set --global theme dark` |
| claude update | Update to latest version | `$ claude update` |
| claude mcp | Configure Model Context Protocol servers | `$ claude mcp add pyright_lsp` |

### CLI flags

| Flag | Description |
|------|-------------|
| --print | Print response without interactive mode |
| --verbose | Enable verbose logging |
| --dangerously-skip-permissions | Skip permission prompts (only in Docker containers without internet) |

### Slash commands

| Command | Purpose |
|---------|---------|
| /bug | Report bugs (sends conversation to Anthropic) |
| /clear | Clear conversation history |
| /compact | Compact conversation to save context space |
| /config | View/modify configuration |
| /cost | Show token usage statistics |
| /doctor | Checks the health of your Claude Code installation |
| /help | Get usage help |
| /init | Initialize project with CLAUDE.md guide |
| /login | Switch Anthropic accounts |
| /logout | Sign out from your Anthropic account |
| /pr_comments | View pull request comments |
| /review | Request code review |
| /terminal-setup | Install Shift+Enter key binding for newlines (iTerm2 and VSCode only) |

## Manage permissions and security

Claude Code uses a tiered permission system to balance power and safety:

| Tool Type | Example | Approval Required | "Yes, don't ask again" Behavior |
|-----------|---------|-------------------|--------------------------------|
| Read-only | File reads, LS, Grep | No | N/A |
| Bash Commands | Shell execution | Yes | Permanently per project directory and command |
| File Modification | Edit/write files | Yes | Until session end |

## Tools available to Claude

Claude Code has access to a set of powerful tools that help it understand and modify your codebase:

| Tool | Description | Permission Required |
|------|-------------|---------------------|
| AgentTool | Runs a sub-agent to handle complex, multi-step tasks | No |
| BashTool | Executes shell commands in your environment | Yes |
| GlobTool | Finds files based on pattern matching | No |
| GrepTool | Searches for patterns in file contents | No |
| LSTool | Lists files and directories | No |
| FileReadTool | Reads the contents of files | No |
| FileEditTool | Makes targeted edits to specific files | Yes |
| FileWriteTool | Creates or overwrites files | Yes |
| NotebookReadTool | Reads and displays Jupyter notebook contents | No |
| NotebookEditTool | Modifies Jupyter notebook cells | Yes |

## Protect against prompt injection

Prompt injection is a technique where an attacker attempts to override or manipulate an AI assistant's instructions by inserting malicious text. Claude Code includes several safeguards against these attacks:

| Safeguard | Description |
|-----------|-------------|
| Permission system | Sensitive operations require explicit approval |
| Context-aware analysis | Detects potentially harmful instructions by analyzing the full request |
| Input sanitization | Prevents command injection by processing user inputs |
| Command blocklist | Blocks risky commands that fetch arbitrary content from the web like curl and wget |

Best practices for working with untrusted content:

- Review suggested commands before approval
- Avoid piping untrusted content directly to Claude
- Verify proposed changes to critical files
- Report suspicious behavior with /bug

While these protections significantly reduce risk, no system is completely immune to all attacks. Always maintain good security practices when working with any AI tool.

## Configure network access

Claude Code requires access to:

| Domain | Purpose |
|--------|---------|
| api.anthropic.com | Core API access |
| statsig.anthropic.com | Statistics and telemetry |
| sentry.io | Error reporting |

Allowlist these URLs when using Claude Code in containerized environments.

## Optimize your terminal setup and configure your environment

Claude Code works best when your terminal is properly configured. Follow these guidelines to optimize your experience.

### Supported shells

| Shell | Support Status |
|-------|---------------|
| Bash | Supported |
| Zsh | Supported |
| Fish | Not currently supported |

### Themes and appearance

Claude cannot control the theme of your terminal. That's handled by your terminal application. You can match Claude Code's theme to your terminal during onboarding or any time via the `/config` command.

### Line breaks

You have several options for entering linebreaks into Claude Code:

| Method | Description |
|--------|-------------|
| Quick escape | Type `\\` followed by Enter to create a newline |
| Keyboard shortcut | Press Option+Enter (Meta+Enter) with proper configuration |

To set up Option+Enter in your terminal:

| Terminal | Configuration Steps |
|----------|---------------------|
| Mac Terminal.app | 1. Open Settings → Profiles → Keyboard<br>2. Check "Use Option as Meta Key" |
| iTerm2 and VSCode terminal | 1. Open Settings → Profiles → Keys<br>2. Under General, set Left/Right Option key to "Esc+" |

Tip for iTerm2 and VSCode users: Run `/terminal-setup` within Claude Code to automatically configure Shift+Enter as a more intuitive alternative.

## Notification setup

Never miss when Claude completes a task with proper notification configuration:

### Terminal bell notifications

Enable sound alerts when tasks complete:

```bash
claude config set --global preferredNotifChannel terminal_bell
```

For macOS users: Don't forget to enable notification permissions in System Settings → Notifications → [Your Terminal App].

### iTerm 2 system notifications

For iTerm 2 alerts when tasks complete:

| Step | Action |
|------|--------|
| 1 | Open iTerm 2 Preferences |
| 2 | Navigate to Profiles → Terminal |
| 3 | Enable "Silence bell" and "Send notification when idle" |
| 4 | Set your preferred notification delay |

Note that these notifications are specific to iTerm 2 and not available in the default macOS Terminal.

### Handling large inputs

When working with extensive code or long instructions:

| Recommendation | Description |
|----------------|-------------|
| Avoid direct pasting | Claude Code may struggle with very long pasted content |
| Use file-based workflows | Write content to a file and ask Claude to read it |
| Be aware of VS Code limitations | The VS Code terminal is particularly prone to truncating long pastes |

By configuring these settings, you'll create a smoother, more efficient workflow with Claude Code.

## Manage costs effectively

Claude Code consumes tokens for each interaction. Typical usage costs range from $5-10 per developer per day, but can exceed $100 per hour during intensive use.

### Track your costs

| Method | Description |
|--------|-------------|
| Use `/cost` | See current session usage |
| Review cost summary | Displayed when exiting |
| Check historical usage | In Anthropic Console |
| Set Spend limits | Control maximum usage |

### Reduce token usage

| Strategy | Description |
|----------|-------------|
| Compact conversations | Use `/compact` when context gets large |
| Write specific queries | Avoid vague requests that trigger unnecessary scanning |
| Break down complex tasks | Split large tasks into focused interactions |
| Clear history between tasks | Use `/clear` to reset context |

Costs can vary significantly based on:

| Factor | Impact |
|--------|--------|
| Size of codebase | Larger codebases require more tokens to analyze |
| Complexity of queries | Complex questions require more processing |
| Number of files | More files searched means more tokens used |
| Length of conversation | Longer history consumes more context |
| Frequency of compacting | Regular compacting reduces token usage |

For team deployments, we recommend starting with a small pilot group to establish usage patterns before wider rollout.

## Use with third-party APIs

### Connect to Amazon Bedrock

```
CLAUDE_CODE_USE_BEDROCK=1
ANTHROPIC_MODEL='us.anthropic.claude-3-7-sonnet-20250219-v1:0'
```

If you don't have prompt caching enabled, also set:

```
DISABLE_PROMPT_CACHING=1
```

Requires standard AWS SDK credentials (e.g., ~/.aws/credentials or relevant environment variables like AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY). Contact Amazon Bedrock for prompt caching for reduced costs and higher rate limits.

### Connect to Google Vertex AI

```
CLAUDE_CODE_USE_VERTEX=1
CLOUD_ML_REGION=us-east5
ANTHROPIC_VERTEX_PROJECT_ID=your-project-id
```

Claude Code on Vertex AI currently only supports the us-east5 region. Make sure your project has quota allocated in this specific region.

Requires standard GCP credentials configured through google-auth-library. For the best experience, contact Google for heightened rate limits.

## Development container reference implementation

Claude Code provides a development container configuration for teams that need consistent, secure environments. This preconfigured devcontainer setup works seamlessly with VS Code's Remote - Containers extension and similar tools.

The container's enhanced security measures (isolation and firewall rules) allow you to run claude --dangerously-skip-permissions to bypass permission prompts for unattended operation. We've included a reference implementation that you can customize for your needs.

While the devcontainer provides substantial protections, no system is completely immune to all attacks. Always maintain good security practices and monitor Claude's activities.

### Key features

| Feature | Description |
|---------|-------------|
| Production-ready Node.js | Built on Node.js 20 with essential development dependencies |
| Security by design | Custom firewall restricting network access to only necessary services |
| Developer-friendly tools | Includes git, ZSH with productivity enhancements, fzf, and more |
| Seamless VS Code integration | Pre-configured extensions and optimized settings |
| Session persistence | Preserves command history and configurations between container restarts |
| Works everywhere | Compatible with macOS, Windows, and Linux development environments |

### Getting started in 4 steps

| Step | Action |
|------|--------|
| 1 | Install VS Code and the Remote - Containers extension |
| 2 | Clone the Claude Code reference implementation repository |
| 3 | Open the repository in VS Code |
| 4 | When prompted, click "Reopen in Container" (or use Command Palette: Cmd+Shift+P → "Remote-Containers: Reopen in Container") |

### Configuration breakdown

| Component | Purpose |
|-----------|---------|
| devcontainer.json | Controls container settings, extensions, and volume mounts |
| Dockerfile | Defines the container image and installed tools |
| init-firewall.sh | Establishes network security rules |

### Security features

| Feature | Description |
|---------|-------------|
| Precise access control | Restricts outbound connections to whitelisted domains only (npm registry, GitHub, Anthropic API, etc.) |
| Default-deny policy | Blocks all other external network access |
| Startup verification | Validates firewall rules when the container initializes |
| Isolation | Creates a secure development environment separated from your main system |

### Customization options

| Option | Description |
|--------|-------------|
| VS Code extensions | Add or remove based on your workflow |
| Resource allocations | Modify for different hardware environments |
| Network access | Adjust permissions as needed |
| Shell configurations | Customize developer tooling |

## Next steps

Claude Code tutorials
Step-by-step guides for common tasks

Reference implementation
Clone our development container reference implementation.

## License and data usage

Claude Code is provided as a Beta research preview under Anthropic's Commercial Terms of Service.

### How we use your data

We aim to be fully transparent about how we use your data. We may use feedback to improve our products and services, but we will not train generative models using your feedback from Claude Code. Given their potentially sensitive nature, we store user feedback transcripts for only 30 days.

### Feedback transcripts

If you choose to send us feedback about Claude Code, such as transcripts of your usage, Anthropic may use that feedback to debug related issues and improve Claude Code's functionality (e.g., to reduce the risk of similar bugs occurring in the future). We will not train generative models using this feedback.

### Privacy safeguards

We have implemented several safeguards to protect your data, including limited retention periods for sensitive information, restricted access to user session data, and clear policies against using feedback for model training.

For full details, please review our Commercial Terms of Service and Privacy Policy.

## License

© Anthropic PBC. All rights reserved. Use is subject to Anthropic's Commercial Terms of Service.
