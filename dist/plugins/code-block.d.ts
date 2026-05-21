/**
 * code-block.ts · block plugin
 *
 * Wraps fenced code blocks in a `.hsr-codeblock` container with an
 * optional meta header showing the filename and language. The meta
 * comes from the fence info string:
 *
 *   ```js · dhr_pdf_builder.js
 *   const x = 1;
 *   ```
 *
 * The format is `<lang> · <filename>` separated by ` · ` (space-mid-space).
 * If no `·` separator is present, just the language is shown as meta.
 *
 * Runs as a rehype/HTML post-pass — operates on rendered HTML.
 */
export declare function wrapCodeBlocks(html: string): string;
//# sourceMappingURL=code-block.d.ts.map