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
import { type RenderOptions, type Medium } from '../renderer.js';
export interface VanillaRenderOptions extends RenderOptions {
    /** Surface medium for the wrapper. Default 'gui'. */
    medium?: Medium;
    /** Extra CSS classes to add to the wrapper alongside .house-style + .medium-X. */
    className?: string;
    /** If true, also output a <link> to shared/tokens.css and components.css at the top.
     *  Path is resolved relative to the consumer's HTML page. Default false. */
    includeStylesheets?: boolean;
    /** Stylesheet href prefix when includeStylesheets is true. Default '../shared/'. */
    stylesheetPrefix?: string;
}
/**
 * Render markdown to a complete HTML fragment, wrapped in the house-style
 * surface container.
 */
export declare function renderToHTML(markdown: string, options?: VanillaRenderOptions): Promise<string>;
//# sourceMappingURL=vanilla.d.ts.map