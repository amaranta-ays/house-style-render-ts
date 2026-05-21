/**
 * adapters/react.tsx · house-style-render
 *
 * React component wrapper around the async renderer. Async because
 * the unified pipeline is promise-based; the component manages its
 * own loading state.
 *
 * Consumer must have React >= 18 installed and must load
 * shared/tokens.css + shared/components.css somewhere in the page
 * (the component does not inject them — that's the consumer's job).
 *
 *   import { MarkdownMessage } from 'house-style-render-ts';
 *   import 'house-style-render-ts/styles.css';      // = shared/tokens.css
 *   import 'house-style-render-ts/components.css';  // = shared/components.css
 *
 *   <MarkdownMessage variant="chat" markdown={assistantOutput} />
 */
import type { ReactElement } from 'react';
import { type RenderOptions } from '../renderer.js';
export type Variant = 'chat' | 'briefing' | 'email' | 'slide' | 'slide-emphasis';
export interface MarkdownMessageProps {
    /** The raw markdown string to render. */
    markdown: string;
    /** Surface variant. Default 'chat'. */
    variant?: Variant;
    /** Extra className on the outer wrapper. */
    className?: string;
    /** Pass-through options to the underlying renderer. */
    options?: Omit<RenderOptions, 'medium'>;
    /** Optional placeholder while the async render resolves. */
    fallback?: ReactElement | string;
}
export declare function MarkdownMessage({ markdown, variant, className, options, fallback, }: MarkdownMessageProps): ReactElement;
//# sourceMappingURL=react.d.ts.map