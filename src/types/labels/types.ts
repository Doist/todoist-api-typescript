import { z } from 'zod'

export const LabelSchema = z.object({
    id: z.string(),
    order: z.number().int().nullable(),
    name: z.string(),
    color: z.string(),
    isFavorite: z.boolean(),
})
/**
 * Represents a label in Todoist.
 * @see https://developer.todoist.com/api/v1/#tag/Labels
 */
export type Label = z.infer<typeof LabelSchema>
