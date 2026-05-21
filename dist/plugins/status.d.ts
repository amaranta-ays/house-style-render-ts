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
export declare function expandStatuses(markdown: string): string;
//# sourceMappingURL=status.d.ts.map