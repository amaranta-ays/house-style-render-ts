/**
 * skip-code.ts · shared utility
 *
 * Run a transformation over a markdown string, skipping any fenced
 * code blocks and inline code spans. Inline plugins should pipe their
 * regex replacement through this so a [atom:X] pattern inside a
 * `<code>` element doesn't get expanded.
 */
const FENCED_CODE = /^(```|~~~)[^\n]*\n[\s\S]*?\n\1[ \t]*(?=\n|$)/gm;
const INLINE_CODE = /`[^`\n]+`/g;
export function skipCodeRegions(markdown, transform) {
    // First split by fenced code blocks
    const fenceSegments = splitByPattern(markdown, FENCED_CODE);
    // Then for non-fenced segments, split by inline code
    return fenceSegments
        .map((seg) => {
        if (seg.isCode)
            return seg.text;
        const inlineSegments = splitByPattern(seg.text, INLINE_CODE);
        return inlineSegments
            .map((s) => (s.isCode ? s.text : transform(s.text)))
            .join('');
    })
        .join('');
}
function splitByPattern(text, pattern) {
    const re = new RegExp(pattern.source, pattern.flags);
    const segments = [];
    let lastIndex = 0;
    let match;
    while ((match = re.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ text: text.slice(lastIndex, match.index), isCode: false });
        }
        segments.push({ text: match[0], isCode: true });
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        segments.push({ text: text.slice(lastIndex), isCode: false });
    }
    return segments;
}
//# sourceMappingURL=skip-code.js.map