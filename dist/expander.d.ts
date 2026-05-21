/**
 * expander.ts · house-style-render
 *
 * Compose the block-syntax plugins into a single pass that runs over
 * a markdown string and returns markdown with custom block syntax
 * expanded to inline HTML. The renderer then parses this through
 * unified/remark/rehype to produce the final HTML.
 *
 * Order matters:
 *   1. Status badges (==status:X==) run before key figures (==X==unit:Y)
 *      because both use the `==` delimiter and status is the more specific
 *      pattern.
 *   2. Block-level callouts (:::focus / :::muted) run last to ensure their
 *      label and body content are already expanded.
 */
import { type AtomRefOptions } from './plugins/atom-ref.js';
import { type NsRecordOptions } from './plugins/ns-record.js';
import { type FileAttachmentOptions } from './plugins/file-attachment.js';
export interface ExpanderOptions {
    atomRef?: AtomRefOptions;
    nsRecord?: NsRecordOptions;
    fileAttachment?: FileAttachmentOptions;
}
/**
 * Run all block-syntax expansions over a markdown string.
 * Output is still valid markdown (with embedded HTML) that the
 * renderer pipeline can parse.
 */
export declare function expandBlocks(markdown: string, options?: ExpanderOptions): string;
//# sourceMappingURL=expander.d.ts.map