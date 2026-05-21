/**
 * atom-ref.ts · block plugin
 *
 * Pattern: [atom:<id>] anywhere in body text.
 * Emits:   <a class="hsr-atom-ref" href="..." data-atom="<id>"><id></a>
 *
 * Skipped inside fenced code blocks and inline code.
 */
export interface AtomRefOptions {
    /** URL prefix for the rendered link. Default '#atom-'. */
    hrefPrefix?: string;
}
export declare function expandAtomRefs(markdown: string, options?: AtomRefOptions): string;
//# sourceMappingURL=atom-ref.d.ts.map