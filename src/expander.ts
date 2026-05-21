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

import { expandStatuses } from './plugins/status.js';
import { expandKeyFigures } from './plugins/key-figure.js';
import { expandAtomRefs, type AtomRefOptions } from './plugins/atom-ref.js';
import { expandNsRecords, type NsRecordOptions } from './plugins/ns-record.js';
import { expandFileAttachments, type FileAttachmentOptions } from './plugins/file-attachment.js';
import { expandCallouts } from './plugins/callout.js';

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
export function expandBlocks(markdown: string, options: ExpanderOptions = {}): string {
  let out = markdown;
  out = expandStatuses(out);
  out = expandKeyFigures(out);
  out = expandAtomRefs(out, options.atomRef);
  out = expandNsRecords(out, options.nsRecord);
  out = expandFileAttachments(out, options.fileAttachment);
  out = expandCallouts(out);
  return out;
}
