/**
 * adapters/email.ts · house-style-render
 *
 * HTML email renderer. Produces a complete email-ready HTML document
 * with:
 *   - <head> containing the Google Fonts <link> + an inlined copy of
 *     tokens.css and components.css scoped to the .house-style .medium-email
 *     container (most email clients support <style> tags in <head>; the
 *     few that don't need true per-element inlining via a tool like juice).
 *   - <body> containing the rendered markdown wrapped in
 *     .house-style .medium-email.
 *
 * For maximum compatibility with strict mail clients (Outlook, some
 * webmail), pass the output through a CSS inliner like juice or
 * premailer before sending. This adapter doesn't bundle juice as a
 * dependency — that's a consumer choice.
 */

import { renderMarkdown, type RenderOptions } from '../renderer.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHARED_DIR = join(__dirname, '..', '..', '..', 'shared');

export interface EmailRenderOptions extends Omit<RenderOptions, 'medium'> {
  /** Email subject line. Will appear in the email's metadata header inside the body. */
  subject?: string;
  /** Sender display (e.g., "Andre Shilenko <andre@reasoncraft.studio>"). */
  from?: string;
  /** Recipient display. */
  to?: string;
  /** ISO date string. Default: today. */
  date?: string;
  /** Pre-loaded tokens.css contents. If omitted, the file is read from disk. */
  tokensCss?: string;
  /** Pre-loaded components.css contents. If omitted, read from disk. */
  componentsCss?: string;
}

/**
 * Render assistant markdown into a complete HTML email document.
 */
export async function renderToInlineHTML(
  markdown: string,
  options: EmailRenderOptions = {},
): Promise<string> {
  const body = await renderMarkdown(markdown, { ...options, medium: 'email' });

  const tokensCss = options.tokensCss ?? safeRead(join(SHARED_DIR, 'tokens.css'));
  const componentsCss = options.componentsCss ?? safeRead(join(SHARED_DIR, 'components.css'));

  const metaHeader = renderMetaHeader(options);

  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    options.subject ? `<title>${escapeHtml(options.subject)}</title>` : '',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">',
    '<style>',
    tokensCss,
    componentsCss,
    '</style>',
    '</head>',
    '<body style="background:#FAFAF8;margin:0;padding:32px 16px;">',
    '<div class="house-style medium-email" style="max-width:540px;margin:0 auto;background:#FAFAF8;padding:32px 24px;border:1px solid #D6CDB8;">',
    metaHeader,
    body,
    '</div>',
    '</body>',
    '</html>',
  ].filter(Boolean).join('\n');
}

function renderMetaHeader(options: EmailRenderOptions): string {
  if (!options.from && !options.to && !options.subject && !options.date) return '';
  const lines: string[] = [];
  if (options.from) lines.push(`<div>From: ${escapeHtml(options.from)}</div>`);
  if (options.to) lines.push(`<div>To: ${escapeHtml(options.to)}</div>`);
  if (options.subject) lines.push(`<div>Subject: ${escapeHtml(options.subject)}</div>`);
  if (options.date) lines.push(`<div>Date: ${escapeHtml(options.date)}</div>`);
  return [
    '<div style="border-bottom:1px solid #D6CDB8;padding-bottom:12px;margin-bottom:16px;font-family:\'JetBrains Mono\',monospace;font-size:11px;color:#6B7280;line-height:1.6;">',
    ...lines,
    '</div>',
  ].join('\n');
}

function safeRead(path: string): string {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '/* tokens/components CSS not found at expected path; pass tokensCss/componentsCss explicitly */';
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
