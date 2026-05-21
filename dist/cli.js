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
function parseArgs(argv) {
    const positional = argv.filter((a) => !a.startsWith('--'));
    const stage = positional[0];
    if (!stage || !['preprocessor', 'expander', 'full'].includes(stage)) {
        process.stderr.write('usage: cli.ts <preprocessor|expander|full> [--input PATH]\n');
        process.exit(2);
    }
    let input;
    const inputIdx = argv.indexOf('--input');
    if (inputIdx >= 0 && argv[inputIdx + 1]) {
        input = argv[inputIdx + 1];
    }
    return { stage, input };
}
async function readInput(input) {
    if (input)
        return readFileSync(input, 'utf8');
    const chunks = [];
    for await (const chunk of process.stdin)
        chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8');
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const raw = await readInput(args.input);
    let out;
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
//# sourceMappingURL=cli.js.map