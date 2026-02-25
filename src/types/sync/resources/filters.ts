import { z } from 'zod'

export const FilterSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        query: z.string(),
        color: z.string(),
        isDeleted: z.boolean(),
        isFavorite: z.boolean(),
        isFrozen: z.boolean(),
        itemOrder: z.number().int(),
    })
    .passthrough()

export type Filter = z.infer<typeof FilterSchema>
