import { z } from 'zod'
import { AttachmentSchema } from '../../entities'

/**
 * Sync API note (comment) resource.
 * Separate from the REST `CommentSchema` which transforms `itemId` to `taskId`.
 */
export const NoteSchema = z
    .object({
        id: z.string(),
        itemId: z.string().optional(),
        projectId: z.string().optional(),
        content: z.string(),
        postedAt: z.string(),
        fileAttachment: AttachmentSchema.nullable(),
        postedUid: z.string(),
        uidsToNotify: z.array(z.string()).nullable(),
        reactions: z.record(z.string(), z.array(z.string())).nullable(),
        isDeleted: z.boolean(),
    })
    .passthrough()

export type Note = z.infer<typeof NoteSchema>
