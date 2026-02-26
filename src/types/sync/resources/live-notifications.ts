import { z } from 'zod'

/**
 * Live notification resource from the Sync API.
 *
 * Uses a base schema with commonly-present fields plus `.passthrough()` for
 * forward compatibility. The Sync API returns 20+ notification variants;
 * fully typing each is too fragile for a library, so we validate the common
 * shape and preserve all extra fields.
 */
export const LiveNotificationSchema = z
    .object({
        id: z.string(),
        createdAt: z.string(),
        fromUid: z.string(),
        notificationType: z.string(),
        isUnread: z.boolean(),
        // Commonly present optional fields
        projectId: z.string().optional(),
        invitationId: z.string().optional(),
        itemId: z.string().optional(),
        itemContent: z.string().optional(),
        responsibleUid: z.string().optional(),
        assignedByUid: z.string().optional(),
        fromUser: z
            .object({
                email: z.string(),
                fullName: z.string(),
                id: z.string(),
                imageId: z.string().nullable(),
            })
            .optional(),
        projectName: z.string().optional(),
        isDeleted: z.boolean().optional(),
        invitationSecret: z.string().optional(),
    })
    .passthrough()

export type LiveNotification = z.infer<typeof LiveNotificationSchema>
