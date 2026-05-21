/**
 * file-attachment.ts · block plugin
 *
 * Pattern: [file:<filename>:<size>:<pages>]
 *          [file:<filename>:<size>]
 *          [file:<filename>]
 * Emits:   <a class="hsr-attachment"> chip with icon, name, and size meta
 *
 * Skipped inside fenced code blocks and inline code.
 */
export interface FileAttachmentOptions {
    /** URL builder. Receives filename and returns href. Default builds a relative ref. */
    hrefBuilder?: (filename: string) => string;
}
export declare function expandFileAttachments(markdown: string, options?: FileAttachmentOptions): string;
//# sourceMappingURL=file-attachment.d.ts.map