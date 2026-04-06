import { z } from 'zod'

export const FolderSchema = z.looseObject({
    id: z.string(),
    name: z.string(),
    workspaceId: z.string(),
    isDeleted: z.boolean(),
    defaultOrder: z.number().int(),
    childOrder: z.number().int(),
})

export type Folder = z.infer<typeof FolderSchema>
