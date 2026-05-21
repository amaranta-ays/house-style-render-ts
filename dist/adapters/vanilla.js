/**
 * adapters/vanilla.ts · house-style-render
 *
 * Framework-free HTML renderer. Returns an HTML string wrapped in the
 * appropriate `.house-style .medium-<X>` container. Consumers are
 * responsible for loading `shared/tokens.css` and `shared/components.css`
 * (via <link> tag or @import) so the rendered HTML actually styles.
 *
 * Use this from Flask templates, exported HTML files, or any context
 * where React isn't running.
 */
import { renderMarkdown } from '../renderer.js';
/**
 * Render markdown to a complete HTML fragment, wrapped in the house-style
 * surface container.
 */
export async function renderToHTML(markdown, options = {}) {
    const medium = options.medium ?? 'gui';
    const inner = await renderMarkdown(markdown, { ...options, medium });
    const extra = options.className ? ` ${options.className}` : '';
    const stylesheets = options.includeStylesheets
        ? renderStylesheets(options.stylesheetPrefix ?? '../shared/')
        : '';
    return `${stylesheets}<div class="house-style medium-${medium}${extra}">${inner}</div>`;
}
function renderStylesheets(prefix) {
    return [
        `<link rel="preconnect" href="https://fonts.googleapis.com">`,
        `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`,
        `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`,
        `<link rel="stylesheet" href="${prefix}tokens.css">`,
        `<link rel="stylesheet" href="${prefix}components.css">`,
    ].join('\n');
}
//# sourceMappingURL=vanilla.js.map