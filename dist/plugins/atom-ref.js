/**
 * atom-ref.ts · block plugin
 *
 * Pattern: [atom:<id>] anywhere in body text.
 * Emits:   <a class="hsr-atom-ref" href="..." data-atom="<id>"><id></a>
 *
 * Skipped inside fenced code blocks and inline code.
 */
import { skipCodeRegions } from '../utils/skip-code.js';
const PATTERN = /\[atom:([a-z][a-z0-9-]*)\]/g;
export function expandAtomRefs(markdown, options = {}) {
    const hrefPrefix = options.hrefPrefix ?? '#atom-';
    return skipCodeRegions(markdown, (segment) => segment.replace(PATTERN, (_full, id) => `<a class="hsr-atom-ref" href="${hrefPrefix}${escapeAttr(id)}" data-atom="${escapeAttr(id)}">${escapeText(id)}</a>`));
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
//# sourceMappingURL=atom-ref.js.map