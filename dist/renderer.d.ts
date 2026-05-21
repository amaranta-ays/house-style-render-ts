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
import { type PreprocessorOptions } from './preprocessor.js';
import { type ExpanderOptions } from './expander.js';
export type Medium = 'gui' | 'document' | 'email' | 'slide' | 'slide-emphasis';
export interface RenderOptions {
    /** Surface medium for the rendered HTML. Default 'gui'. */
    medium?: Medium;
    /** Skip preprocessor (clean markdown stage). Default false. */
    skipPreprocess?: boolean;
    /** Skip block-syntax expansion. Default false. */
    skipExpand?: boolean;
    /** Pass-through options to the preprocessor. */
    preprocessor?: PreprocessorOptions;
    /** Pass-through options to the expander. */
    expander?: ExpanderOptions;
}
/**
 * Render assistant markdown to house-styled HTML.
 *
 * Returns a string of HTML body content (no <html>/<head>/<body>
 * wrapper). Caller is responsible for the page chrome and for
 * including shared/tokens.css + shared/components.css.
 */
export declare function renderMarkdown(markdown: string, options?: RenderOptions): Promise<string>;
/** Synchronous-style wrapper for environments that prefer await-free calls. */
export declare function renderMarkdownSync(markdown: string, options?: RenderOptions): Promise<string>;
//# sourceMappingURL=renderer.d.ts.map