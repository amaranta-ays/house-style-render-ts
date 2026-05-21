/**
 * preprocessor.ts · house-style-render
 *
 * Sanitize AI-slop patterns out of a markdown string.
 *
 * The preprocessor is a regex-based pass that strips formatting noise
 * (default bold, all-caps headings, decorative dividers, heading
 * explosion, performative punctuation) while preserving the actual
 * content. It does NOT rewrite prose, restructure paragraphs, or add
 * semantic blocks — those decisions belong to the author or to higher-
 * level cleanup.
 *
 * Code blocks (fenced with ``` or ~~~) are preserved verbatim — no
 * transformation runs inside them.
 *
 * The Python sibling at py/house_style_render/preprocessor.py must
 * produce byte-identical output for the same input. The parity gate
 * at parity/run-parity.sh asserts this against shared/fixtures/.
 */
export interface PreprocessorOptions {
    /** Convert ALL CAPS HEADINGS to Title Case. Default true. */
    normalizeAllCapsHeadings?: boolean;
    /** Strip default bold (**text** → text) in body context. Default true. */
    stripDefaultBold?: boolean;
    /** Remove decorative horizontal rules (3+ dashes/asterisks/underscores alone on a line). Default true. */
    stripDecorativeRules?: boolean;
    /** Demote headings deeper than h3 (####+ → ###). Default true. */
    flattenHeadingExplosion?: boolean;
    /** Collapse 2+ exclamation marks to 1. Default true. */
    normalizeBangs?: boolean;
    /** Strip bold-as-label pattern at start of list items (`- **X**: Y` → `- X: Y`). Default true. */
    normalizeListLabels?: boolean;
}
/**
 * Clean assistant-emitted markdown of AI-slop formatting patterns.
 *
 * @example
 * cleanAssistantMarkdown('# **EXECUTIVE BRIEF**')
 *   // → '# Executive Brief'
 *
 * @example
 * cleanAssistantMarkdown('- **Phase**: Discovery\n\n---\n\nNext')
 *   // → '- Phase: Discovery\n\nNext'
 */
export declare function cleanAssistantMarkdown(raw: string, options?: PreprocessorOptions): string;
//# sourceMappingURL=preprocessor.d.ts.map