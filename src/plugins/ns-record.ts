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

export interface NsRecordOptions {
  /** URL builder. Receives (type, id) and returns href. */
  hrefBuilder?: (type: string, id: string) => string;
}

export function expandNsRecords(
  markdown: string,
  options: NsRecordOptions = {},
): string {
  const buildHref = options.hrefBuilder ?? defaultHref;
  return skipCodeRegions(markdown, (segment) =>
    segment.replace(PATTERN, (_full, type: string, id: string, name?: string) => {
      const href = buildHref(type, id);
      const parts = [
        `<span class="hsr-ns-type">${escapeText(type)}</span>`,
        `<span class="hsr-ns-id">${escapeText(id)}</span>`,
      ];
      if (name) parts.push(`<span class="hsr-ns-name">${escapeText(name)}</span>`);
      return `<a class="hsr-ns-record" href="${escapeAttr(href)}">${parts.join('')}</a>`;
    }),
  );
}

function defaultHref(type: string, id: string): string {
  return `#${type.toLowerCase()}-${id}`;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
