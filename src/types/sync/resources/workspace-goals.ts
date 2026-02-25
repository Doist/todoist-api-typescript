import { z } from 'zod'

export const WorkspaceGoalMilestoneSchema = z
    .object({
        id: z.string(),
        title: z.string(),
        isCompleted: z.boolean(),
    })
    .passthrough()

export type WorkspaceGoalMilestone = z.infer<typeof WorkspaceGoalMilestoneSchema>

export const WorkspaceGoalProgressSchema = z
    .object({
        completedItems: z.number().int(),
        totalItems: z.number().int(),
    })
    .passthrough()

export type WorkspaceGoalProgress = z.infer<typeof WorkspaceGoalProgressSchema>

export const WorkspaceGoalSchema = z
    .object({
        id: z.string(),
        workspaceId: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        deadline: z.string().nullable(),
        isDeleted: z.boolean(),
        projectIds: z.array(z.string()),
        progress: WorkspaceGoalProgressSchema.nullable(),
        creatorUid: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
    .passthrough()

export type WorkspaceGoal = z.infer<typeof WorkspaceGoalSchema>
