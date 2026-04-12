import type {
    ComposerExtensionContext,
    ContextMenuExtensionContext,
    UiExtensionType,
} from './types'

/**
 * Arguments for adding a new UI extension to a developer application.
 */
export type AddUiExtensionArgs = {
    /** The developer application (integration) ID the extension belongs to. */
    integrationId: string
    /** Kind of extension. */
    extensionType: UiExtensionType
    /** HTTPS URL the extension loads. */
    url: string
    /** Extension display name. */
    name: string
    /** Extension description. */
    description: string
    /** Rendered width in pixels. */
    width?: number | null
    /** Rendered height in pixels. */
    height?: number | null
    /** Optional HTTPS URL for the extension icon. */
    icon?: string | null
    /** Extension definition version. Defaults to the backend default. */
    defVersion?: number
    /** Minimum Cardist renderer version required, as a decimal version string (e.g. `'0.60'`). */
    minimumCardistVersion?: string
    /** Optional client-specified extension ID (server generates one if omitted). */
    extensionId?: string | null
    /** Applicable only to `context-menu` extensions — the context they appear in. */
    contextType?: ContextMenuExtensionContext
    /** Applicable only to `composer` extensions — the composer they appear in. */
    composerType?: ComposerExtensionContext
}

/**
 * Arguments for updating a UI extension. All fields are optional —
 * only provided fields are updated. Nullable shapes mirror the response
 * schema so a `UiExtension` can be round-tripped back into an update call.
 */
export type UpdateUiExtensionArgs = {
    extensionType?: UiExtensionType
    url?: string
    name?: string
    description?: string
    width?: number | null
    height?: number | null
    icon?: string | null
    defVersion?: number
    minimumCardistVersion?: string
    extensionId?: string | null
    contextType?: ContextMenuExtensionContext
    composerType?: ComposerExtensionContext
}

/**
 * Arguments for uploading a UI extension icon.
 */
export type UploadUiExtensionIconArgs = {
    /** The UI extension ID. */
    uiExtensionId: string
    /** The icon file to upload (Buffer, Stream, or file path). */
    file: Buffer | NodeJS.ReadableStream | string | Blob
    /** The file name (required for Buffer/Stream uploads). */
    fileName?: string
}
