/**
 * status.ts · block plugin
 *
 * Pattern: ==status:<state>==
 *          where <state> ∈ { approved, draft, overdue, blocked }
 * Emits:   <span class="hsr-status hsr-status-<state>"><State></span>
 *
 * Skipped inside fenced code blocks and inline code.
 *
 * Must run BEFORE key-figure.ts so the leading "status:" prefix
 * isn't consumed by the key-figure pattern.
 */
import { skipCodeRegions } from '../utils/skip-code.js';
const KNOWN = new Set(['approved', 'draft', 'overdue', 'blocked', 'active', 'on-hold']);
const PATTERN = /==status:([a-z][a-z-]*)==/gi;
export function expandStatuses(markdown) {
    return skipCodeRegions(markdown, (segment) => segment.replace(PATTERN, (_full, rawState) => {
        const state = rawState.toLowerCase();
        const label = capitalize(state);
        const classes = KNOWN.has(state)
            ? `hsr-status hsr-status-${state}`
            : 'hsr-status';
        return `<span class="${classes}">${escapeText(label)}</span>`;
    }));
}
function capitalize(s) {
    if (!s)
        return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function escapeText(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
//# sourceMappingURL=status.js.map