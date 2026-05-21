/**
 * file-attachment.ts · block plugin
 *
 * Pattern: [file:<filename>:<size>:<pages>]
 *          [file:<filename>:<size>]
 *          [file:<filename>]
 * Emits:   <a class="hsr-attachment"> chip with icon, name, and size meta
 *
 * Skipped inside fenced code blocks and inline code.
 */
import { skipCodeRegions } from '../utils/skip-code.js';
const PATTERN = /\[file:([^:\]]+)(?::([^:\]]+))?(?::([^\]]+))?\]/g;
const ICON_SVG = '<svg class="hsr-attachment-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M9 2H3v12h10V6H9V2z M9 2l4 4h-4V2z"/></svg>';
export function expandFileAttachments(markdown, options = {}) {
    const buildHref = options.hrefBuilder ?? ((filename) => `#file-${slug(filename)}`);
    return skipCodeRegions(markdown, (segment) => segment.replace(PATTERN, (_full, filename, size, pages) => {
        const meta = [size, pages ? `${pages} pp` : null].filter(Boolean).join(' · ');
        const metaHtml = meta ? `<span class="hsr-attachment-size">${escapeText(meta)}</span>` : '';
        return [
            `<a class="hsr-attachment" href="${escapeAttr(buildHref(filename))}">`,
            ICON_SVG,
            '<span class="hsr-attachment-meta">',
            `<span class="hsr-attachment-name">${escapeText(filename)}</span>`,
            metaHtml,
            '</span>',
            '</a>',
        ].join('');
    }));
}
function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
//# sourceMappingURL=file-attachment.js.map