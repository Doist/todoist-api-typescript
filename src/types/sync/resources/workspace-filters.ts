import { z } from 'zod'

export const WorkspaceFilterSchema = z.looseObject({
    id: z.string(),
    workspaceId: z.string(),
    name: z.string(),
    query: z.string(),
    color: z.string(),
    itemOrder: z.number().int(),
    isDeleted: z.boolean(),
    isFavorite: z.boolean(),
    isFrozen: z.boolean(),
    creatorUid: z.string(),
    updaterUid: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type WorkspaceFilter = z.infer<typeof WorkspaceFilterSchema>
