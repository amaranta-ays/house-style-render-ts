import { jsx as _jsx } from "react/jsx-runtime";
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
import { useEffect, useState } from 'react';
import { renderMarkdown } from '../renderer.js';
/** Map UX-level variant names to renderer medium names. */
const VARIANT_TO_MEDIUM = {
    chat: 'gui',
    briefing: 'document',
    email: 'email',
    slide: 'slide',
    'slide-emphasis': 'slide-emphasis',
};
export function MarkdownMessage({ markdown, variant = 'chat', className, options, fallback, }) {
    const [html, setHtml] = useState('');
    const [ready, setReady] = useState(false);
    const medium = VARIANT_TO_MEDIUM[variant];
    useEffect(() => {
        let cancelled = false;
        setReady(false);
        renderMarkdown(markdown, { ...options, medium }).then((rendered) => {
            if (!cancelled) {
                setHtml(rendered);
                setReady(true);
            }
        });
        return () => {
            cancelled = true;
        };
        // The options object is treated as referentially-stable by the caller;
        // if the caller wants a remount on options change, they should change
        // the markdown prop too.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markdown, medium]);
    const wrapperClass = [
        'house-style',
        `medium-${medium}`,
        className,
    ].filter(Boolean).join(' ');
    if (!ready && fallback !== undefined) {
        return (_jsx("div", { className: wrapperClass, children: typeof fallback === 'string' ? fallback : fallback }));
    }
    return (_jsx("div", { className: wrapperClass, dangerouslySetInnerHTML: { __html: html } }));
}
//# sourceMappingURL=react.js.map