import { z } from 'zod'

export const IdMappingSchema = z.object({
    oldId: z.string().nullable(),
    newId: z.string().nullable(),
})
/** Mapping between old and new IDs after migration. */
export type IdMapping = z.infer<typeof IdMappingSchema>

export const MovedIdSchema = z.object({
    oldId: z.string(),
    newId: z.string(),
})
/** A moved ID pair (old to new). */
export type MovedId = z.infer<typeof MovedIdSchema>
