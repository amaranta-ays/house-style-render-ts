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
export {};
//# sourceMappingURL=cli.d.ts.map