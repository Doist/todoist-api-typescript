import { z } from 'zod'
import { WorkspaceRoleSchema } from '../../entities'

export const CollaboratorSchema = z
    .object({
        id: z.string(),
        email: z.string(),
        fullName: z.string(),
        timezone: z.string(),
        imageId: z.string().nullable(),
    })
    .passthrough()

export type Collaborator = z.infer<typeof CollaboratorSchema>

export const CollaboratorStateSchema = z
    .object({
        userId: z.string(),
        projectId: z.string(),
        state: z.enum(['active', 'invited']),
        isDeleted: z.boolean(),
        workspaceRole: WorkspaceRoleSchema.optional(),
    })
    .passthrough()

export type CollaboratorState = z.infer<typeof CollaboratorStateSchema>
