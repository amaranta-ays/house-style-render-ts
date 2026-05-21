/**
 * key-figure.ts · block plugin
 *
 * Pattern: ==<value>==unit:<unit-text>
 *          ==<value>==              (no unit)
 * Emits:   <span class="hsr-key-figure"> with value + optional unit
 *
 * Skipped inside fenced code blocks and inline code.
 */

import { skipCodeRegions } from '../utils/skip-code.js';

// ==value==unit:UNIT-TEXT. The unit-text can include spaces but not pipe or newline.
const PATTERN = /==([^=\n]+)==(?:unit:([^\s|][^|\n]*?))?(?=\s|$|[.,;:!?])/g;

export function expandKeyFigures(markdown: string): string {
  return skipCodeRegions(markdown, (segment) =>
    segment.replace(PATTERN, (_full, value: string, unit?: string) => {
      const valueHtml = `<span class="hsr-kf-value">${escapeText(value.trim())}</span>`;
      const unitHtml = unit
        ? ` <span class="hsr-kf-unit">${escapeText(unit.trim())}</span>`
        : '';
      return `<span class="hsr-key-figure">${valueHtml}${unitHtml}</span>`;
    }),
  );
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
