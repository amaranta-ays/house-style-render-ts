/**
 * callout.ts · block plugin
 *
 * Block syntax:
 *   :::focus Optional label
 *   Body paragraph 1.
 *
 *   Body paragraph 2.
 *   :::
 *
 *   :::muted Optional label
 *   Body content.
 *   :::
 *
 * Emits:
 *   <aside class="hsr-callout"> or <aside class="hsr-callout hsr-callout-muted">
 *   containing <span class="hsr-callout-label"> and <div class="hsr-callout-body">.
 *
 * Body content is preserved as markdown; the surrounding `<aside>` is raw HTML
 * that rehype-raw will pass through. Body markdown is NOT processed here —
 * the outer renderer pipeline parses it after expansion. To make that work
 * we wrap the body in a sentinel HTML comment so subsequent passes don't
 * mistreat the body content.
 */
export declare function expandCallouts(markdown: string): string;
//# sourceMappingURL=callout.d.ts.map