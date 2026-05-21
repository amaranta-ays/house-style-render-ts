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
const CODE_BLOCK_RE = /<pre><code(?:\s+class="(?:language-)?([^"]*)")?[^>]*>([\s\S]*?)<\/code><\/pre>/g;
export function wrapCodeBlocks(html) {
    return html.replace(CODE_BLOCK_RE, (_full, langInfo, body) => {
        let lang = '';
        let filename = '';
        if (langInfo) {
            const parts = langInfo.split('·').map((p) => p.trim());
            if (parts.length >= 2) {
                lang = parts[0];
                filename = parts.slice(1).join(' · ');
            }
            else {
                lang = parts[0];
            }
        }
        const meta = filename
            ? `<span>${escapeText(filename)}</span><span class="tnum">${escapeText(lang)}</span>`
            : lang
                ? `<span>${escapeText(lang)}</span>`
                : '';
        const metaHtml = meta ? `<div class="hsr-codeblock-meta">${meta}</div>` : '';
        return [
            '<div class="hsr-codeblock">',
            metaHtml,
            `<pre><code${langInfo ? ` class="language-${escapeAttr(langInfo.split('·')[0].trim())}"` : ''}>${body}</code></pre>`,
            '</div>',
        ].join('');
    });
}
function escapeAttr(value) {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
function escapeText(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
//# sourceMappingURL=code-block.js.map