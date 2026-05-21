/**
 * ns-record.ts · block plugin
 *
 * Pattern: [record:<type>:<id>] or [record:<type>:<id>:<name>]
 * Emits:   <a class="hsr-ns-record"> with type/id/name spans
 *
 * Skipped inside fenced code blocks and inline code.
 */
export interface NsRecordOptions {
    /** URL builder. Receives (type, id) and returns href. */
    hrefBuilder?: (type: string, id: string) => string;
}
export declare function expandNsRecords(markdown: string, options?: NsRecordOptions): string;
//# sourceMappingURL=ns-record.d.ts.map