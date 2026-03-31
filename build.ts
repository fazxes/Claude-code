#!/usr/bin/env bun
/**
 * Build script for Claude Code from leaked source.
 *
 * Usage: bun build.ts
 */
import { $ } from 'bun';

const version = process.env.VERSION || '2.1.88';
const buildTime = new Date().toISOString();

console.log(`Building Claude Code v${version}...`);

const result = await Bun.build({
  entrypoints: ['src/entrypoints/cli.tsx'],
  outdir: 'dist',
  target: 'bun',
  sourcemap: 'linked',
  define: {
    'MACRO.VERSION': JSON.stringify(version),
    'MACRO.BUILD_TIME': JSON.stringify(buildTime),
    'MACRO.FEEDBACK_CHANNEL': JSON.stringify('#claude-code'),
    'MACRO.ISSUES_EXPLAINER': JSON.stringify(
      'report the issue at https://github.com/anthropics/claude-code/issues',
    ),
  },
  external: ['react-devtools-core', 'sharp'],
});

if (!result.success) {
  console.error('Build failed:');
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log(`Build succeeded: dist/cli.js (${(result.outputs[0]!.size / 1024 / 1024).toFixed(1)} MB)`);
