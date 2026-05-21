/**
 * index.ts · house-style-render TS public API
 */
export { cleanAssistantMarkdown, type PreprocessorOptions, } from './preprocessor.js';
export { expandBlocks, type ExpanderOptions, } from './expander.js';
export { renderMarkdown, type RenderOptions, type Medium, } from './renderer.js';
export { renderToHTML, type VanillaRenderOptions } from './adapters/vanilla.js';
export { MarkdownMessage, type MarkdownMessageProps, type Variant } from './adapters/react.js';
export { OrbitSpinner, type OrbitSpinnerProps } from './adapters/orbit-spinner.js';
export { expandAtomRefs, type AtomRefOptions } from './plugins/atom-ref.js';
export { expandNsRecords, type NsRecordOptions } from './plugins/ns-record.js';
export { expandFileAttachments, type FileAttachmentOptions } from './plugins/file-attachment.js';
export { expandKeyFigures } from './plugins/key-figure.js';
export { expandStatuses } from './plugins/status.js';
export { expandCallouts } from './plugins/callout.js';
export { wrapCodeBlocks } from './plugins/code-block.js';
export { rewriteFootnotesForHouseStyle } from './plugins/citation.js';
//# sourceMappingURL=index.d.ts.map