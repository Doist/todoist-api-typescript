import { z } from 'zod'

/** Available template types. */
export const TEMPLATE_TYPES = ['project', 'setup'] as const
/** Type of template suggestion. */
export type TemplateType = (typeof TEMPLATE_TYPES)[number]

export const TemplateSuggestionSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        templateType: z.enum(TEMPLATE_TYPES),
    })
    .passthrough()

export type TemplateSuggestion = z.infer<typeof TemplateSuggestionSchema>

export const WorkspaceTemplateSuggestionSchema = TemplateSuggestionSchema.extend({
    workspaceId: z.string().nullable(),
})

export type WorkspaceTemplateSuggestion = z.infer<typeof WorkspaceTemplateSuggestionSchema>

/** Available suggestion section types. */
export const SUGGESTION_SECTION_TYPES = ['templates', 'most_used_user_templates'] as const
/** Type of suggestion section. */
export type SuggestionSectionType = (typeof SUGGESTION_SECTION_TYPES)[number]

export const SyncTemplateSuggestionsSchema = z
    .object({
        type: z.enum(SUGGESTION_SECTION_TYPES),
        content: z.object({
            templates: z.array(TemplateSuggestionSchema),
            locale: z.string(),
        }),
        isDeleted: z.boolean(),
    })
    .passthrough()

export const SyncWorkspaceTemplateSuggestionsSchema = z
    .object({
        type: z.literal('most_used_workspace_templates'),
        content: z.object({
            templates: z.array(WorkspaceTemplateSuggestionSchema),
            locale: z.string(),
        }),
        isDeleted: z.boolean(),
    })
    .passthrough()

export const SuggestionSchema = z.union([
    SyncWorkspaceTemplateSuggestionsSchema,
    SyncTemplateSuggestionsSchema,
])

export type Suggestion = z.infer<typeof SuggestionSchema>
