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
import type { ReactElement } from 'react';
import { renderMarkdown, type RenderOptions, type Medium } from '../renderer.js';

export type Variant = 'chat' | 'briefing' | 'email' | 'slide' | 'slide-emphasis';

/** Map UX-level variant names to renderer medium names. */
const VARIANT_TO_MEDIUM: Record<Variant, Medium> = {
  chat: 'gui',
  briefing: 'document',
  email: 'email',
  slide: 'slide',
  'slide-emphasis': 'slide-emphasis',
};

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

export function MarkdownMessage({
  markdown,
  variant = 'chat',
  className,
  options,
  fallback,
}: MarkdownMessageProps): ReactElement {
  const [html, setHtml] = useState<string>('');
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
    return (
      <div className={wrapperClass}>
        {typeof fallback === 'string' ? fallback : fallback}
      </div>
    );
  }

  return (
    <div
      className={wrapperClass}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
