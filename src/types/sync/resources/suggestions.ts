import { z } from 'zod'

export const TemplateSuggestionSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        templateType: z.enum(['project', 'setup']),
    })
    .passthrough()

export type TemplateSuggestion = z.infer<typeof TemplateSuggestionSchema>

export const WorkspaceTemplateSuggestionSchema = TemplateSuggestionSchema.extend({
    workspaceId: z.string().nullable(),
})

export type WorkspaceTemplateSuggestion = z.infer<typeof WorkspaceTemplateSuggestionSchema>

const SyncTemplateSuggestionsSchema = z
    .object({
        type: z.enum(['templates', 'most_used_user_templates']),
        content: z.object({
            templates: z.array(TemplateSuggestionSchema),
            locale: z.string(),
        }),
        isDeleted: z.boolean(),
    })
    .passthrough()

const SyncWorkspaceTemplateSuggestionsSchema = z
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
