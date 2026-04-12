import { z } from 'zod'
import { StringOrNumberSchema } from '../common'

/**
 * Discriminator values for the UI extension variants.
 * Exposed as an enum-like object because the values are used in `z.literal()`
 * across multiple variant schemas (see AGENTS.md "Discriminated unions" exception).
 */
export const UiExtensionTypeEnum = {
    ContextMenu: 'context-menu',
    Composer: 'composer',
    Settings: 'settings',
} as const

/**
 * All UI extension type values.
 */
export const UI_EXTENSION_TYPES = [
    UiExtensionTypeEnum.ContextMenu,
    UiExtensionTypeEnum.Composer,
    UiExtensionTypeEnum.Settings,
] as const
/**
 * Type of UI extension.
 */
export type UiExtensionType = (typeof UI_EXTENSION_TYPES)[number]

/**
 * Context locations where a context-menu extension can appear.
 */
export const CONTEXT_MENU_EXTENSION_CONTEXTS = ['project', 'task'] as const
/**
 * Context location of a context-menu UI extension.
 */
export type ContextMenuExtensionContext = (typeof CONTEXT_MENU_EXTENSION_CONTEXTS)[number]

export const ContextMenuExtensionContextSchema = z.enum(CONTEXT_MENU_EXTENSION_CONTEXTS)

/**
 * Composer locations where a composer extension can appear.
 */
export const COMPOSER_EXTENSION_CONTEXTS = ['task', 'comment'] as const
/**
 * Composer location of a composer UI extension.
 */
export type ComposerExtensionContext = (typeof COMPOSER_EXTENSION_CONTEXTS)[number]

export const ComposerExtensionContextSchema = z.enum(COMPOSER_EXTENSION_CONTEXTS)

/**
 * Shared fields across all UI extension variants.
 */
export const UiExtensionBaseSchema = z.object({
    id: StringOrNumberSchema,
    integrationId: StringOrNumberSchema,
    extensionId: z.string(),
    url: z.string(),
    icon: z.string().nullable(),
    name: z.string(),
    description: z.string(),
    width: z.number().int().nullable(),
    height: z.number().int().nullable(),
    defVersion: z.number().int(),
    minimumCardistVersion: z.string(),
})

/**
 * Schema for a context-menu UI extension.
 */
export const ContextMenuExtensionSchema = UiExtensionBaseSchema.extend({
    extensionType: z.literal(UiExtensionTypeEnum.ContextMenu),
    contextType: ContextMenuExtensionContextSchema,
})

/**
 * A context-menu UI extension.
 */
export type ContextMenuExtension = z.infer<typeof ContextMenuExtensionSchema>

/**
 * Schema for a composer UI extension.
 */
export const ComposerExtensionSchema = UiExtensionBaseSchema.extend({
    extensionType: z.literal(UiExtensionTypeEnum.Composer),
    composerType: ComposerExtensionContextSchema,
})

/**
 * A composer UI extension.
 */
export type ComposerExtension = z.infer<typeof ComposerExtensionSchema>

/**
 * Schema for a settings UI extension.
 */
export const SettingsExtensionSchema = UiExtensionBaseSchema.extend({
    extensionType: z.literal(UiExtensionTypeEnum.Settings),
})

/**
 * A settings UI extension.
 */
export type SettingsExtension = z.infer<typeof SettingsExtensionSchema>

/**
 * Discriminated union of all UI extension variants.
 */
export const UiExtensionSchema = z.discriminatedUnion('extensionType', [
    ContextMenuExtensionSchema,
    ComposerExtensionSchema,
    SettingsExtensionSchema,
])

/**
 * A UI extension attached to a developer application.
 */
export type UiExtension = z.infer<typeof UiExtensionSchema>
