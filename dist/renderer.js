/**
 * renderer.ts · house-style-render
 *
 * The unified pipeline that turns an assistant-emitted markdown
 * string into house-styled HTML.
 *
 *   preprocessor → expander → unified(remark-parse + remark-gfm
 *     + remark-rehype + rehype-raw + rehype-stringify) → post-process
 *
 * The post-processing pass wraps code blocks (`<pre><code>`) with the
 * .hsr-codeblock container and rewrites GFM footnotes into the
 * .hsr-citation-list format.
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { cleanAssistantMarkdown, } from './preprocessor.js';
import { expandBlocks } from './expander.js';
import { wrapCodeBlocks } from './plugins/code-block.js';
import { rewriteFootnotesForHouseStyle } from './plugins/citation.js';
/**
 * Render assistant markdown to house-styled HTML.
 *
 * Returns a string of HTML body content (no <html>/<head>/<body>
 * wrapper). Caller is responsible for the page chrome and for
 * including shared/tokens.css + shared/components.css.
 */
export async function renderMarkdown(markdown, options = {}) {
    const cleaned = options.skipPreprocess
        ? markdown
        : cleanAssistantMarkdown(markdown, options.preprocessor);
    const expanded = options.skipExpand
        ? cleaned
        : expandBlocks(cleaned, options.expander);
    const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(expanded);
    let html = String(file);
    html = wrapCodeBlocks(html);
    html = rewriteFootnotesForHouseStyle(html);
    return html;
}
/** Synchronous-style wrapper for environments that prefer await-free calls. */
export function renderMarkdownSync(markdown, options = {}) {
    return renderMarkdown(markdown, options);
}
//# sourceMappingURL=renderer.js.map