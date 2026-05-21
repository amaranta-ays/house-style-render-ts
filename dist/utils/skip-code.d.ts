/**
 * skip-code.ts · shared utility
 *
 * Run a transformation over a markdown string, skipping any fenced
 * code blocks and inline code spans. Inline plugins should pipe their
 * regex replacement through this so a [atom:X] pattern inside a
 * `<code>` element doesn't get expanded.
 */
export declare function skipCodeRegions(markdown: string, transform: (segment: string) => string): string;
//# sourceMappingURL=skip-code.d.ts.map