/**
 * callout.ts · block plugin
 *
 * Block syntax:
 *   :::focus Optional label
 *   Body paragraph 1.
 *
 *   Body paragraph 2.
 *   :::
 *
 *   :::muted Optional label
 *   Body content.
 *   :::
 *
 * Emits:
 *   <aside class="hsr-callout"> or <aside class="hsr-callout hsr-callout-muted">
 *   containing <span class="hsr-callout-label"> and <div class="hsr-callout-body">.
 *
 * Body content is preserved as markdown; the surrounding `<aside>` is raw HTML
 * that rehype-raw will pass through. Body markdown is NOT processed here —
 * the outer renderer pipeline parses it after expansion. To make that work
 * we wrap the body in a sentinel HTML comment so subsequent passes don't
 * mistreat the body content.
 */

const PATTERN = /^:::(focus|muted)(?:[ \t]+([^\n]+))?\n([\s\S]*?)\n:::[ \t]*$/gm;

export function expandCallouts(markdown: string): string {
  return markdown.replace(PATTERN, (_full, kind: string, label: string | undefined, body: string) => {
    const variantClass = kind === 'muted' ? 'hsr-callout hsr-callout-muted' : 'hsr-callout';
    const labelHtml = label
      ? `<span class="hsr-callout-label">${escapeText(label.trim())}</span>\n`
      : '';
    // Body is left as markdown — wrap in a div so block content (paragraphs,
    // lists) parses correctly when the body sits inside an <aside>. The
    // blank lines around the body keep markdown's paragraph detection intact.
    return [
      `<aside class="${variantClass}">`,
      labelHtml + '<div class="hsr-callout-body">',
      '',
      body.trim(),
      '',
      '</div>',
      '</aside>',
    ].join('\n');
  });
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
