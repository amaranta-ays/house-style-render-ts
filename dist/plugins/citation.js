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
export function rewriteFootnotesForHouseStyle(html) {
    // Rewrite the inline citation chip
    let out = html.replace(/<sup><a([^>]*)class="([^"]*\bfootnote-ref\b[^"]*)"([^>]*)>([^<]+)<\/a><\/sup>/g, (_full, before, classes, after, label) => {
        const cleanedClasses = classes.replace(/\bfootnote-ref\b/, '').trim();
        const merged = cleanedClasses ? `hsr-citation ${cleanedClasses}` : 'hsr-citation';
        return `<a class="${merged}"${before}${after}>[${label}]</a>`;
    });
    // Rewrite the footnote section wrapper
    out = out.replace(/<section[^>]*data-footnotes[^>]*>([\s\S]*?)<\/section>/, (_full, inner) => {
        // Strip the inner H2 "Footnotes" heading that GFM generates
        const stripped = inner.replace(/<h2[^>]*id=["']footnote-label["'][^>]*>[\s\S]*?<\/h2>/, '');
        return `<div class="hsr-citation-list">${stripped}</div>`;
    });
    return out;
}
//# sourceMappingURL=citation.js.map