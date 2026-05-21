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
export declare function OrbitSpinner({ size, className, label, }: OrbitSpinnerProps): ReactElement;
//# sourceMappingURL=orbit-spinner.d.ts.map