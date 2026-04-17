# Claude Mythos Preview CLI (Entertainment Purposes / Joke)

To run:
```sh
bun dist/cli.js
```

In claude code:
```claude
/model mythos-preview
/model default
/model
```

This is NOT real Claude Mythos Preview - this is simply for entertainment purposes. 
The underlying model of Mythos Preview is Opus Plan Mode.


<br/><br/><br/>

### Original Repository: fazxes/claude-code

# Claude Code — Rebuilt from Leaked Source

> **Disclaimer:** This repository contains proprietary source code belonging to Anthropic that was unintentionally exposed via a source map file (`.js.map`) included in the official `@anthropic-ai/claude-code` npm package. This repository is provided strictly for **educational and research purposes** — to study the architecture, design patterns, and engineering of a production-grade AI coding agent. This project is not affiliated with, endorsed by, or authorized by Anthropic. If you are a representative of Anthropic and wish to have this repository removed, please open an issue or contact the repository owner. **Use at your own risk.** The authors assume no liability for any use or misuse of this code.

---

On March 31, 2026, the full source code of Anthropic's Claude Code CLI was leaked via a `.map` file exposed in their npm registry. This repo contains that source rebuilt into a runnable CLI.

## Quick Start

**Prerequisites:** [Bun](https://bun.sh) v1.1+

```bash
git clone https://github.com/fazxes/claude-code.git
cd claude-code
bun install
bun run build
bun dist/cli.js
```

That's it. The CLI will launch and prompt you to authenticate via OAuth (same flow as the official Claude Code).

## Commands

```bash
bun dist/cli.js                    # Launch interactive REPL
bun dist/cli.js --help             # Show all options
bun dist/cli.js --version          # Show version
bun dist/cli.js -p "your prompt"   # Non-interactive mode (pipe-friendly)
bun dist/cli.js auth login         # Authenticate
```

## How It Was Leaked

[Chaofan Shou (@Fried_rice)](https://x.com/Fried_rice) discovered the leak:

> **"Claude code source code has been leaked via a map file in their npm registry!"**
>
> — [@Fried_rice, March 31, 2026](https://x.com/Fried_rice/status/2038894956459290963)

The source map in the published npm package contained a reference to the full, unobfuscated TypeScript source, downloadable as a zip from Anthropic's R2 storage bucket.

## What's Inside

- **~1,900 source files**, 512,000+ lines of TypeScript
- **Runtime:** Bun
- **Terminal UI:** React + custom forked [Ink](https://github.com/vadimdemedes/ink)
- **CLI parser:** Commander.js
- **Layout engine:** Pure TypeScript port of Yoga (Meta's flexbox engine)

### Architecture

```
src/
├── main.tsx                 # Entrypoint (Commander.js CLI parser)
├── commands.ts              # Command registry
├── tools.ts                 # Tool registry (~40 tools)
├── QueryEngine.ts           # LLM query engine (Anthropic API)
├── context.ts               # System/user context collection
├── ink/                     # Custom Ink fork (terminal React renderer)
├── commands/                # Slash command implementations
├── tools/                   # Agent tool implementations
├── components/              # React UI components
├── services/                # API, MCP, OAuth, telemetry
├── screens/                 # Full-screen UIs (REPL, Doctor)
├── native-ts/               # Pure TS ports of native modules
│   ├── yoga-layout/         # Flexbox layout engine
│   ├── color-diff/          # Syntax-highlighted diffs
│   └── file-index/          # Fuzzy file search
└── vim/                     # Vim mode implementation
```

## What's Stubbed Out

Some internal Anthropic features weren't included in the leak or are behind private packages. These are stubbed with no-ops:

- **Computer Use** (`@ant/computer-use-*`) — screen control tools
- **Chrome Integration** (`@ant/claude-for-chrome-mcp`) — browser automation
- **Sandbox Runtime** (`@anthropic-ai/sandbox-runtime`) — sandboxed execution
- **TungstenTool, REPLTool** — internal-only tools
- **Context Collapse** — internal compaction feature

The core CLI, all standard tools (Bash, Edit, Read, Write, Grep, Glob, etc.), MCP support, and the full terminal UI work.

## Build Details

The build script (`build.ts`) uses Bun's bundler to:
1. Bundle 4,500+ modules into a single `dist/cli.js` (~21 MB)
2. Define `MACRO.*` build-time constants (version, feedback channel)
3. Externalize optional native deps (`sharp`, `react-devtools-core`)

Feature flags from `bun:bundle`'s `feature()` all return `false` — internal Anthropic features (voice mode, coordinator mode, etc.) are disabled.

## Telemetry

By default, Claude Code sends telemetry to Anthropic (event logging, Datadog, GrowthBook). To disable all telemetry:

```bash
DISABLE_TELEMETRY=1 bun dist/cli.js
```

Or for maximum privacy:

```bash
DISABLE_TELEMETRY=1 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 bun dist/cli.js
```

## Disclaimer

This repository contains proprietary source code that was unintentionally made public by Anthropic through their npm package distribution. It is provided here for educational and research purposes only.

- This project is **not affiliated with Anthropic**
- No warranty is provided, express or implied
- Users are responsible for their own compliance with applicable laws
- This repository may be subject to takedown at Anthropic's request
- **Do not use this for commercial purposes**
