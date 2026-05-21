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
import { type RenderOptions } from '../renderer.js';
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
export declare function renderToInlineHTML(markdown: string, options?: EmailRenderOptions): Promise<string>;
//# sourceMappingURL=email.d.ts.map