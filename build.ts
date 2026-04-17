#!/usr/bin/env bun
/**
 * Build script for Claude Code from leaked source.
 *
 * Replicates Anthropic's build pipeline:
 * 1. feature() flags resolved via Bun plugin (compile-time replacement)
 * 2. MACRO.* constants inlined at compile time
 * 3. Single-file bundle targeting Bun runtime
 *
 * To enable a feature: set it to true in FEATURE_FLAGS below.
 * WARNING: Only enable flags marked SAFE. Others will crash at runtime
 * because source modules are missing or stubbed.
 */

import type { BunPlugin } from 'bun';
import { resolve } from 'path';

const version = process.env.VERSION || '2.1.88';
const buildTime = new Date().toISOString();
const packageJson = (await Bun.file('package.json').json()) as {
  dependencies?: Record<string, string>;
};
const dependencyExternals = Object.keys(packageJson.dependencies ?? {});

// ── Feature Flags ─────────────────────────────────────────────────────────
//
// Status key:
//   SAFE    = source exists, tested, works
//   UNTESTED = source exists but not verified at runtime
//   MISSING = required source files don't exist, will crash
//   STUB    = module exists but is an empty stub
//   INFRA   = needs backend infrastructure we don't have
//
const FEATURE_FLAGS: Record<string, boolean> = {
  // ── TESTED & WORKING ──────────────────────────────────────────────
  VOICE_MODE: false,                 // hold-to-talk dictation

  // ── TESTING NOW (source exists, loaded without crash) ─────────────
  COORDINATOR_MODE: false,           // multi-agent coordination
  TOKEN_BUDGET: false,               // token budget controls
  TEAMMEM: false,                    // team memory sync
  AGENT_TRIGGERS: false,             // scheduled agent tasks
  MESSAGE_ACTIONS: false,            // action buttons on messages
  HOOK_PROMPTS: false,               // hook prompt injection
  AWAY_SUMMARY: false,               // summary after being away
  BG_SESSIONS: false,                // background sessions
  BUDDY: false,                      // companion mode
  DUMP_SYSTEM_PROMPT: false,         // --dump-system-prompt flag
  COWORKER_TYPE_TELEMETRY: false,    // telemetry metadata

  // ── INFRA (needs Anthropic cloud) ─────────────────────────────────
  ULTRAPLAN: false,                  // INFRA: spawns remote CCR session on claude.ai
  BRIDGE_MODE: false,                // INFRA: needs bridge server
  CHICAGO_MCP: false,                // INFRA: needs native Swift/Rust binaries
  TRANSCRIPT_CLASSIFIER: false,      // MISSING: prompt .txt files DCE'd from leak

  // ── MISSING SOURCE ────────────────────────────────────────────────
  KAIROS: false,                     // MISSING: src/assistant/index.ts, src/proactive/
  KAIROS_BRIEF: false,               // MISSING: depends on KAIROS
  PROACTIVE: false,                  // MISSING: src/proactive/
  WORKFLOW_SCRIPTS: false,           // MISSING: WorkflowTool.ts
  WEB_BROWSER_TOOL: false,           // MISSING: WebBrowserPanel.ts
  TERMINAL_PANEL: false,             // MISSING: TerminalCaptureTool/
  EXPERIMENTAL_SKILL_SEARCH: false,  // MISSING: DiscoverSkillsTool/
  HISTORY_SNIP: false,               // STUB: empty snipCompact.ts
  CACHED_MICROCOMPACT: false,        // STUB: empty cachedMicrocompact.ts

  // ── OFF by design ─────────────────────────────────────────────────
  ABLATION_BASELINE: false,          // DEGRADES quality — never enable
  OVERFLOW_TEST_TOOL: false,         // internal test tool
};

// ── Bun Plugin: bun:bundle shim ───────────────────────────────────────────
const bunBundlePlugin: BunPlugin = {
  name: 'bun-bundle-shim',
  setup(build) {
    build.onResolve({ filter: /^bun:bundle$/ }, () => ({
      path: 'bun:bundle',
      namespace: 'bun-bundle-shim',
    }));

    build.onLoad({ filter: /.*/, namespace: 'bun-bundle-shim' }, () => ({
      contents: `
        const FLAGS = ${JSON.stringify(FEATURE_FLAGS)};
        export function feature(name) {
          return FLAGS[name] ?? false;
        }
      `,
      loader: 'js',
    }));

    // Route unavailable private/native modules to local stubs so external builds
    // remain bundleable and runnable without Anthropic-internal binaries.
    const moduleAliases: Record<string, string> = {
      '@ant/claude-for-chrome-mcp': 'stubs/@ant/claude-for-chrome-mcp/src/index.ts',
      'color-diff-napi': 'stubs/color-diff-napi/index.ts',
      'audio-capture-napi': 'shims/audio-capture-napi.ts',
      'modifiers-napi': 'shims/modifiers-napi.ts',
    };

    build.onResolve({ filter: /.*/ }, args => {
      const target = moduleAliases[args.path];
      if (!target) {
        return;
      }
      return { path: resolve(process.cwd(), target) };
    });
  },
};

// ── Build ─────────────────────────────────────────────────────────────────
console.log(`Building Claude Code v${version}...`);

const enabledFlags = Object.entries(FEATURE_FLAGS)
  .filter(([, v]) => v)
  .map(([k]) => k);
if (enabledFlags.length > 0) {
  console.log(`Enabled flags: ${enabledFlags.join(', ')}`);
} else {
  console.log(`All feature flags disabled (external build)`);
}

const result = await Bun.build({
  entrypoints: ['src/entrypoints/cli.tsx'],
  outdir: 'dist',
  target: 'bun',
  sourcemap: 'linked',
  plugins: [bunBundlePlugin],
  define: {
    'MACRO.VERSION': JSON.stringify(version),
    'MACRO.BUILD_TIME': JSON.stringify(buildTime),
    'MACRO.FEEDBACK_CHANNEL': JSON.stringify('#claude-code'),
    'MACRO.ISSUES_EXPLAINER': JSON.stringify(
      'report the issue at https://github.com/anthropics/claude-code/issues',
    ),
  },
  external: [
    ...dependencyExternals,
    // Optional dependencies kept external even when absent.
    'react-devtools-core',
    'sharp',
  ],
});

if (!result.success) {
  console.error('Build failed:');
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log(`Build succeeded: dist/cli.js (${(result.outputs[0]!.size / 1024 / 1024).toFixed(1)} MB)`);
