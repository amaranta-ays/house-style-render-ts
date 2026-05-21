#!/usr/bin/env node
/**
 * cli.ts · house-style-render TS CLI
 *
 * Used by the parity gate to invoke the TS pipeline from a Python
 * orchestrator. Reads markdown from stdin (or --input <path>), runs
 * the requested stage, writes result to stdout.
 *
 *   tsx ts/src/cli.ts preprocessor < input.md
 *   tsx ts/src/cli.ts expander     < input.md
 *   tsx ts/src/cli.ts full         < input.md     # preprocessor + expander
 */

import { readFileSync } from 'node:fs';
import { cleanAssistantMarkdown } from './preprocessor.js';
import { expandBlocks } from './expander.js';

interface CliArgs {
  stage: 'preprocessor' | 'expander' | 'full';
  input?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const positional = argv.filter((a) => !a.startsWith('--'));
  const stage = positional[0] as CliArgs['stage'];
  if (!stage || !['preprocessor', 'expander', 'full'].includes(stage)) {
    process.stderr.write('usage: cli.ts <preprocessor|expander|full> [--input PATH]\n');
    process.exit(2);
  }
  let input: string | undefined;
  const inputIdx = argv.indexOf('--input');
  if (inputIdx >= 0 && argv[inputIdx + 1]) {
    input = argv[inputIdx + 1];
  }
  return { stage, input };
}

async function readInput(input: string | undefined): Promise<string> {
  if (input) return readFileSync(input, 'utf8');
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const raw = await readInput(args.input);

  let out: string;
  switch (args.stage) {
    case 'preprocessor':
      out = cleanAssistantMarkdown(raw);
      break;
    case 'expander':
      out = expandBlocks(raw);
      break;
    case 'full':
      out = expandBlocks(cleanAssistantMarkdown(raw));
      break;
  }
  process.stdout.write(out);
}

main().catch((err) => {
  process.stderr.write(String(err) + '\n');
  process.exit(1);
});
