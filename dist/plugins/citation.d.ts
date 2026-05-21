/**
 * citation.ts · block plugin
 *
 * remark-gfm already handles `[^1]` inline references and `[^1]: …`
 * footnote definitions. This plugin's job is presentation:
 *
 *   - The inline `[^1]` gets rendered by remark-gfm as
 *     `<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref class="footnote-ref">1</a></sup>`
 *     We post-process that into `.hsr-citation` chips.
 *   - The footnote section gets rendered as a `<section data-footnotes>`
 *     with an `<ol>` inside. We rewrite the wrapper to `.hsr-citation-list`.
 *
 * Runs as a rehype/HTML post-pass — operates on rendered HTML, not markdown.
 */
export declare function rewriteFootnotesForHouseStyle(html: string): string;
//# sourceMappingURL=citation.d.ts.map