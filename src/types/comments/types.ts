import { z } from 'zod'

/** Available file attachment upload states. */
export const UPLOAD_STATES = ['pending', 'completed'] as const
/** Upload state of a file attachment. */
export type UploadState = (typeof UPLOAD_STATES)[number]

export const AttachmentSchema = z
    .object({
        resourceType: z.string(),
    })
    .extend({
        fileName: z.string().nullable().optional(),
        fileSize: z.number().int().nullable().optional(),
        fileType: z.string().nullable().optional(),
        fileUrl: z.string().nullable().optional(),
        fileDuration: z.number().int().nullable().optional(),
        uploadState: z.enum(UPLOAD_STATES).nullable().optional(),
        image: z.string().nullable().optional(),
        imageWidth: z.number().int().nullable().optional(),
        imageHeight: z.number().int().nullable().optional(),
        url: z.string().nullable().optional(),
        title: z.string().nullable().optional(),
    })
/**
 * Represents a file attachment in a comment.
 * @see https://developer.todoist.com/api/v1/#tag/Sync/Comments/File-Attachments
 */
export type Attachment = z.infer<typeof AttachmentSchema>

export const RawCommentSchema = z
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
    .refine(
        (data) => {
            // At least one of itemId or projectId must be present
            return (
                (data.itemId !== undefined && data.projectId === undefined) ||
                (data.itemId === undefined && data.projectId !== undefined)
            )
        },
        {
            message: 'Exactly one of itemId or projectId must be provided',
        },
    )

/**
 * Represents a raw comment response from the API.
 * @see https://developer.todoist.com/api/v1/#tag/Comments
 */
export type RawComment = z.infer<typeof RawCommentSchema>

export const CommentSchema = RawCommentSchema.transform((data) => {
    const { itemId, ...rest } = data
    return {
        ...rest,
        // Map itemId to taskId for backwards compatibility
        taskId: itemId,
    }
})
/**
 * Represents a comment in Todoist.
 * @see https://developer.todoist.com/api/v1/#tag/Comments
 */
export type Comment = z.infer<typeof CommentSchema>
