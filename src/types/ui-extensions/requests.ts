import type {
    ComposerExtensionContext,
    ContextMenuExtensionContext,
    UiExtensionType,
} from './types'
import { UiExtensionTypeEnum } from './types'

/**
 * Fields common to every UI extension variant — shared across all add/update
 * request shapes.
 */
type BaseUiExtensionFields = {
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
}

/** Arguments for adding a context-menu UI extension. */
export type AddContextMenuExtensionArgs = BaseUiExtensionFields & {
    /** The developer application (integration) ID the extension belongs to. */
    integrationId: string
    extensionType: typeof UiExtensionTypeEnum.ContextMenu
    /** Where the extension appears. */
    contextType: ContextMenuExtensionContext
}

/** Arguments for adding a composer UI extension. */
export type AddComposerExtensionArgs = BaseUiExtensionFields & {
    /** The developer application (integration) ID the extension belongs to. */
    integrationId: string
    extensionType: typeof UiExtensionTypeEnum.Composer
    /** Which composer the extension appears in. */
    composerType: ComposerExtensionContext
}

/** Arguments for adding a settings UI extension. */
export type AddSettingsExtensionArgs = BaseUiExtensionFields & {
    /** The developer application (integration) ID the extension belongs to. */
    integrationId: string
    extensionType: typeof UiExtensionTypeEnum.Settings
}

/**
 * Arguments for adding a new UI extension to a developer application.
 * Discriminated on `extensionType` so impossible combinations
 * (e.g. `settings` + `contextType`) fail at compile time.
 */
export type AddUiExtensionArgs =
    | AddContextMenuExtensionArgs
    | AddComposerExtensionArgs
    | AddSettingsExtensionArgs

/**
 * Fields that are optional on every update variant.
 */
type UpdateUiExtensionFields = {
    url?: string
    name?: string
    description?: string
    width?: number | null
    height?: number | null
    icon?: string | null
    defVersion?: number
    minimumCardistVersion?: string
    extensionId?: string | null
}

/**
 * Arguments for updating a context-menu UI extension.
 * `extensionType` is required to discriminate the variant — callers
 * already have it from the fetched `UiExtension`.
 */
export type UpdateContextMenuExtensionArgs = UpdateUiExtensionFields & {
    extensionType: typeof UiExtensionTypeEnum.ContextMenu
    contextType?: ContextMenuExtensionContext
}

/**
 * Arguments for updating a composer UI extension.
 */
export type UpdateComposerExtensionArgs = UpdateUiExtensionFields & {
    extensionType: typeof UiExtensionTypeEnum.Composer
    composerType?: ComposerExtensionContext
}

/**
 * Arguments for updating a settings UI extension.
 */
export type UpdateSettingsExtensionArgs = UpdateUiExtensionFields & {
    extensionType: typeof UiExtensionTypeEnum.Settings
}

/**
 * Arguments for updating a UI extension — all value fields are optional
 * but `extensionType` is required so TypeScript can discriminate which
 * variant-specific fields (`contextType`, `composerType`) apply.
 */
export type UpdateUiExtensionArgs =
    | UpdateContextMenuExtensionArgs
    | UpdateComposerExtensionArgs
    | UpdateSettingsExtensionArgs

// Retained as a type-level escape hatch for consumers that genuinely need
// the variant-specific types.
export type { UiExtensionType }

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
