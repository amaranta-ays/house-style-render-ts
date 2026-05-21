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

const DEFAULTS: Required<PreprocessorOptions> = {
  normalizeAllCapsHeadings: true,
  stripDefaultBold: true,
  stripDecorativeRules: true,
  flattenHeadingExplosion: true,
  normalizeBangs: true,
  normalizeListLabels: true,
};

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
export function cleanAssistantMarkdown(
  raw: string,
  options: PreprocessorOptions = {},
): string {
  const opts = { ...DEFAULTS, ...options };
  const segments = splitByCodeFences(raw);
  return segments
    .map((seg) => (seg.isCode ? seg.text : transformSegment(seg.text, opts)))
    .join('');
}

// ──────────────────────────────────────────────────────────────────────
// Internals
// ──────────────────────────────────────────────────────────────────────

interface Segment {
  text: string;
  isCode: boolean;
}

/**
 * Split a markdown string into alternating prose and fenced-code segments.
 * Fences are ``` or ~~~ on a line of their own; opening and closing must
 * match. Code content is preserved verbatim by callers.
 */
function splitByCodeFences(raw: string): Segment[] {
  const fenceRe = /^(```|~~~)[^\n]*\n[\s\S]*?\n\1[ \t]*(?=\n|$)/gm;
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = fenceRe.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: raw.slice(lastIndex, match.index), isCode: false });
    }
    segments.push({ text: match[0], isCode: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < raw.length) {
    segments.push({ text: raw.slice(lastIndex), isCode: false });
  }
  return segments;
}

function transformSegment(
  text: string,
  opts: Required<PreprocessorOptions>,
): string {
  let out = text;
  // Order matters: normalize headings before stripping bold, so the
  // heading detector can see the original markup.
  if (opts.normalizeAllCapsHeadings) out = normalizeAllCapsHeadings(out);
  if (opts.flattenHeadingExplosion) out = flattenHeadingExplosion(out);
  if (opts.stripDecorativeRules) out = stripDecorativeRules(out);
  if (opts.normalizeListLabels) out = normalizeListLabels(out);
  if (opts.stripDefaultBold) out = stripDefaultBold(out);
  if (opts.normalizeBangs) out = normalizeBangs(out);
  return out;
}

/**
 * If a heading is mostly uppercase (>60% of letters), title-case it.
 * Also strips any **bold** markup around the heading text.
 */
function normalizeAllCapsHeadings(text: string): string {
  return text.replace(
    /^(#{1,6}[ \t]+)(.+)$/gm,
    (_full, hashes: string, content: string) => {
      const unboldedContent = content.replace(/\*\*([^*]+)\*\*/g, '$1');
      const letters = unboldedContent.replace(/[^a-zA-Z]/g, '');
      if (letters.length < 3) return hashes + unboldedContent;
      const caps = unboldedContent.replace(/[^A-Z]/g, '').length;
      const ratio = caps / letters.length;
      if (ratio > 0.6) {
        return hashes + toTitleCase(unboldedContent);
      }
      return hashes + unboldedContent;
    },
  );
}

/**
 * AP-style title case with a small word list. Words in the small list
 * stay lowercase unless they're the first word of the heading.
 */
function toTitleCase(text: string): string {
  const small = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of',
    'on', 'or', 'the', 'to', 'with', 'vs', 'via',
  ]);
  const parts = text.toLowerCase().split(/(\s+)/);
  let firstWordSeen = false;
  return parts
    .map((part) => {
      if (/^\s+$/.test(part)) return part;
      if (!firstWordSeen) {
        firstWordSeen = true;
        return capitalize(part);
      }
      if (small.has(part)) return part;
      return capitalize(part);
    })
    .join('');
}

function capitalize(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Demote any heading deeper than h3 to h3. h4+ in chat/briefing/email
 * surfaces produces visual heading explosion; collapsing to h3 keeps
 * the size hierarchy intact at three levels.
 */
function flattenHeadingExplosion(text: string): string {
  return text.replace(/^#{4,}([ \t]+.+)$/gm, '###$1');
}

/**
 * Remove lines that are decorative rules: 3+ dashes, asterisks, or
 * underscores alone on a line. Preserves intentional content rules
 * (e.g., "---\nmetadata\n---" front-matter, which has content lines
 * between the fences and survives this pass).
 *
 * Specifically: a "decorative rule" is a single line of 3+ matching
 * symbols with only whitespace around it, surrounded by blank lines
 * or document boundaries. The replacement strips the rule line and
 * one of the surrounding blanks to avoid leaving a double-newline gap.
 */
function stripDecorativeRules(text: string): string {
  return text
    // Remove decorative rule preceded by blank line: \n\n---\n → \n
    .replace(/\n\n[ \t]*[-*_]{3,}[ \t]*(?=\n)/g, '')
    // Remove decorative rule at start of doc
    .replace(/^[ \t]*[-*_]{3,}[ \t]*\n/, '');
}

/**
 * Convert `- **Label**: value` and `* **Label**: value` to `- Label: value`.
 * Only matches when the bold-wrapped span is the first content after
 * the list marker and is followed by a colon.
 */
function normalizeListLabels(text: string): string {
  return text.replace(
    /^([ \t]*[-*+][ \t]+)\*\*([^*\n]+)\*\*(\s*:)/gm,
    '$1$2$3',
  );
}

/**
 * Strip **text** → text everywhere outside code blocks. The house style
 * uses Inter italic for emphasis, not bold; if the author wanted true
 * emphasis they should use *text*. This is destructive but reversible
 * (the cleaned-up output is still valid markdown).
 *
 * Bold inside list-label position is handled earlier by
 * normalizeListLabels — this pass strips the remainder.
 */
function stripDefaultBold(text: string): string {
  return text.replace(/\*\*([^*\n]+)\*\*/g, '$1');
}

/**
 * Collapse 2+ exclamation marks to a single mark. Multiple bangs are an
 * AI slop tell for performative enthusiasm; one mark carries the same
 * semantic without the noise.
 */
function normalizeBangs(text: string): string {
  return text.replace(/!{2,}/g, '!');
}
