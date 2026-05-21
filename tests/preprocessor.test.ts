/**
 * preprocessor.test.ts · house-style-render TS
 *
 * Each test case targets one AI-slop pattern documented in the Setpoint
 * fixture at shared/fixtures/ai-slop-input.md. The Python sibling
 * py/tests/test_preprocessor.py runs the same cases against the Python
 * implementation; the parity gate diffs the outputs.
 */

import { describe, it, expect } from 'vitest';
import { cleanAssistantMarkdown } from '../src/preprocessor.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = join(__dirname, '..', '..', 'shared', 'fixtures');

describe('cleanAssistantMarkdown', () => {

  // ── all-caps headings ──────────────────────────────────────────
  describe('all-caps headings', () => {
    it('normalizes all-caps H1 to title case', () => {
      expect(cleanAssistantMarkdown('# EXECUTIVE BRIEF')).toBe('# Executive Brief');
    });

    it('strips bold and normalizes all-caps in one pass', () => {
      expect(cleanAssistantMarkdown('# **EXECUTIVE BRIEF**')).toBe('# Executive Brief');
    });

    it('leaves normal-case headings untouched', () => {
      expect(cleanAssistantMarkdown('# Normal Heading')).toBe('# Normal Heading');
    });

    it('keeps small words lowercase in title case', () => {
      expect(cleanAssistantMarkdown('## A REPORT ON THE PROJECT')).toBe('## A Report on the Project');
    });

    it('handles H3 with mixed caps + bold', () => {
      expect(cleanAssistantMarkdown('### **THE CORE CHALLENGE**')).toBe('### The Core Challenge');
    });

    it('does not title-case short headings (< 3 letters)', () => {
      expect(cleanAssistantMarkdown('# OK')).toBe('# OK');
    });
  });

  // ── decorative horizontal rules ────────────────────────────────
  describe('decorative horizontal rules', () => {
    it('strips standalone --- between paragraphs', () => {
      const input = 'First paragraph.\n\n---\n\nSecond paragraph.';
      expect(cleanAssistantMarkdown(input)).toBe('First paragraph.\n\nSecond paragraph.');
    });

    it('strips standalone *** between paragraphs', () => {
      const input = 'First.\n\n***\n\nSecond.';
      expect(cleanAssistantMarkdown(input)).toBe('First.\n\nSecond.');
    });

    it('strips rule at document start', () => {
      const input = '---\n\nFirst paragraph.';
      expect(cleanAssistantMarkdown(input)).toBe('\nFirst paragraph.');
    });

    it('handles multiple decorative rules in one pass', () => {
      const input = 'A.\n\n---\n\nB.\n\n---\n\nC.';
      expect(cleanAssistantMarkdown(input)).toBe('A.\n\nB.\n\nC.');
    });
  });

  // ── heading explosion ──────────────────────────────────────────
  describe('heading explosion', () => {
    it('demotes h4 to h3', () => {
      expect(cleanAssistantMarkdown('#### Subsection')).toBe('### Subsection');
    });

    it('demotes h5 and h6 to h3', () => {
      expect(cleanAssistantMarkdown('##### Deep\n###### Deeper')).toBe('### Deep\n### Deeper');
    });

    it('leaves h1, h2, h3 alone', () => {
      const input = '# H1\n## H2\n### H3';
      expect(cleanAssistantMarkdown(input)).toBe('# H1\n## H2\n### H3');
    });
  });

  // ── default bold ───────────────────────────────────────────────
  describe('default bold', () => {
    it('strips bold around a word', () => {
      expect(cleanAssistantMarkdown('This is **important** text.')).toBe('This is important text.');
    });

    it('strips bold around a phrase', () => {
      expect(cleanAssistantMarkdown('Look at **the central issue** here.')).toBe('Look at the central issue here.');
    });

    it('preserves italics', () => {
      expect(cleanAssistantMarkdown('Use *italic* for emphasis.')).toBe('Use *italic* for emphasis.');
    });

    it('handles multiple bold spans in one paragraph', () => {
      const input = '**First**, **second**, and **third** points.';
      expect(cleanAssistantMarkdown(input)).toBe('First, second, and third points.');
    });
  });

  // ── list labels ────────────────────────────────────────────────
  describe('list labels', () => {
    it('strips bold from `- **Label**: value` patterns', () => {
      expect(cleanAssistantMarkdown('- **Phase**: Discovery')).toBe('- Phase: Discovery');
    });

    it('strips bold from `* **Label**: value` patterns', () => {
      expect(cleanAssistantMarkdown('* **Status**: Active')).toBe('* Status: Active');
    });

    it('handles multiple bullets in sequence', () => {
      const input = '- **One**: a\n- **Two**: b\n- **Three**: c';
      const expected = '- One: a\n- Two: b\n- Three: c';
      expect(cleanAssistantMarkdown(input)).toBe(expected);
    });
  });

  // ── exclamation marks ──────────────────────────────────────────
  describe('exclamation marks', () => {
    it('collapses triple bang to single', () => {
      expect(cleanAssistantMarkdown('Wow!!!')).toBe('Wow!');
    });

    it('collapses double bang to single', () => {
      expect(cleanAssistantMarkdown('Look!!')).toBe('Look!');
    });

    it('leaves single bang alone', () => {
      expect(cleanAssistantMarkdown('Look!')).toBe('Look!');
    });
  });

  // ── code block preservation ────────────────────────────────────
  describe('code block preservation', () => {
    it('does not strip bold inside fenced code blocks', () => {
      const input = 'Before.\n\n```js\nconst x = "**not bold**";\n```\n\nAfter.';
      // Bold inside code is preserved; bold outside is stripped.
      expect(cleanAssistantMarkdown(input)).toContain('"**not bold**"');
    });

    it('does not normalize all-caps inside code blocks', () => {
      const input = '# OUTSIDE HEADING\n\n```\n# INSIDE HEADING\n```';
      const out = cleanAssistantMarkdown(input);
      expect(out).toContain('# Outside Heading');
      expect(out).toContain('# INSIDE HEADING');
    });

    it('does not strip decorative rules inside code blocks', () => {
      const input = 'A.\n\n```\n---\n```\n\nB.';
      const out = cleanAssistantMarkdown(input);
      expect(out).toContain('```\n---\n```');
    });

    it('handles tilde fences', () => {
      const input = '~~~\n# CODE\n~~~';
      expect(cleanAssistantMarkdown(input)).toBe('~~~\n# CODE\n~~~');
    });
  });

  // ── option toggles ─────────────────────────────────────────────
  describe('option toggles', () => {
    it('respects { stripDefaultBold: false }', () => {
      expect(
        cleanAssistantMarkdown('**bold**', { stripDefaultBold: false }),
      ).toBe('**bold**');
    });

    it('respects { normalizeAllCapsHeadings: false }', () => {
      expect(
        cleanAssistantMarkdown('# YELLING', { normalizeAllCapsHeadings: false }),
      ).toBe('# YELLING');
    });
  });

  // ── integration · whole-fixture pass ──────────────────────────
  describe('integration · ai-slop-input fixture', () => {
    it('produces a cleaner version of the Setpoint AI-slop sample', () => {
      const raw = readFileSync(join(FIXTURE_DIR, 'ai-slop-input.md'), 'utf8');
      const cleaned = cleanAssistantMarkdown(raw);

      // Whole-fixture properties the cleaned output must satisfy:
      expect(cleaned).not.toMatch(/^# .*\*\*/m); // no bold in h1
      expect(cleaned).not.toMatch(/^# [A-Z][A-Z][A-Z]+/m); // no all-caps h1
      expect(cleaned).not.toMatch(/\*\*[A-Za-z]+\*\*/); // no inline bold left
      expect(cleaned).not.toMatch(/!{2,}/); // no triple bangs
      expect(cleaned).not.toMatch(/^####/m); // no h4+ headings
      expect(cleaned).not.toMatch(/^\s*-{3,}\s*$/m); // no decorative rules
    });
  });
});
