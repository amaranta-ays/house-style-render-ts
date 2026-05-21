/**
 * ns-record.ts · block plugin
 *
 * Pattern: [record:<type>:<id>] or [record:<type>:<id>:<name>]
 * Emits:   <a class="hsr-ns-record"> with type/id/name spans
 *
 * Skipped inside fenced code blocks and inline code.
 */
import { skipCodeRegions } from '../utils/skip-code.js';
const PATTERN = /\[record:([^:\]]+):([^:\]]+)(?::([^\]]+))?\]/g;
export function expandNsRecords(markdown, options = {}) {
    const buildHref = options.hrefBuilder ?? defaultHref;
    return skipCodeRegions(markdown, (segment) => segment.replace(PATTERN, (_full, type, id, name) => {
        const href = buildHref(type, id);
        const parts = [
            `<span class="hsr-ns-type">${escapeText(type)}</span>`,
            `<span class="hsr-ns-id">${escapeText(id)}</span>`,
        ];
        if (name)
            parts.push(`<span class="hsr-ns-name">${escapeText(name)}</span>`);
        return `<a class="hsr-ns-record" href="${escapeAttr(href)}">${parts.join('')}</a>`;
    }));
}
function defaultHref(type, id) {
    return `#${type.toLowerCase()}-${id}`;
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
//# sourceMappingURL=ns-record.js.map