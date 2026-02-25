import { z } from 'zod'

export const FolderSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        workspaceId: z.string(),
        isDeleted: z.boolean(),
        defaultOrder: z.number().int(),
        childOrder: z.number().int(),
    })
    .passthrough()

export type Folder = z.infer<typeof FolderSchema>
