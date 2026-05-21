/**
 * adapters/orbit-spinner.tsx · house-style-render
 *
 * Canonical "agent thinking / streaming" indicator. The only sanctioned
 * infinite-loop motion in the house style — a functional async indicator
 * (not decoration). See knowledge/house-style/motion.md "Functional
 * Async-State Carve-out" for the spec rule.
 *
 *   import { OrbitSpinner } from 'house-style-render-ts';
 *   import 'house-style-render-ts/components.css';  // provides .orbit rotation
 *
 *   <OrbitSpinner size={16} />           // 16px, currentColor
 *   <OrbitSpinner size={24} className="text-teal-700" />
 *
 * Color comes from the parent's `color:` rule (fill="currentColor"). The
 * rotation animation comes from the .orbit class in components.css. The
 * per-circle opacity-chase animations are inline SVG <animate> elements
 * baked into this component.
 *
 * Sizing guide (cross-project review 2026-05-13):
 *   12px       inline in a button
 *   16-18px    inside a 28-32px avatar bubble (chat)
 *   20-24px    standalone in message body or loading-msg row
 *   32-48px    full-pane / empty-state loader
 */

import type { ReactElement } from 'react';

export interface OrbitSpinnerProps {
  /** Pixel size. Default 20 (standalone-in-message). */
  size?: number;
  /** Extra className passed through to the outer <svg>. */
  className?: string;
  /** ARIA label. Defaults to "Loading…" — override for context-specific copy. */
  label?: string;
}

export function OrbitSpinner({
  size = 20,
  className = '',
  label = 'Loading…',
}: OrbitSpinnerProps): ReactElement {
  return (
    <svg
      className={`orbit ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
    >
      <g>
        {/* Rotation runs as SMIL animateTransform inside the SVG so it
            works identically here (inline circles) and in HTML consumers
            that reference the symbol via <use href="#orbit-symbol"/>. */}
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.9" />
        <circle cx="12" cy="4" r="1.5" fill="currentColor" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="18.9" cy="8" r="1.5" fill="currentColor" opacity="0.5">
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.5s"
            begin="0.25s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="18.9" cy="16" r="1.5" fill="currentColor" opacity="0.7">
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="1.5s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="12" cy="20" r="1.5" fill="currentColor" opacity="0.5">
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.5s"
            begin="0.75s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="5.1" cy="16" r="1.5" fill="currentColor" opacity="0.3">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            begin="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="5.1" cy="8" r="1.5" fill="currentColor" opacity="0.7">
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="1.5s"
            begin="1.25s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}
