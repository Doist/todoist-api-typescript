import { z } from 'zod'

export const WorkspaceGoalMilestoneSchema = z.looseObject({
    id: z.string(),
    title: z.string(),
    isCompleted: z.boolean(),
})

export type WorkspaceGoalMilestone = z.infer<typeof WorkspaceGoalMilestoneSchema>

export const WorkspaceGoalProgressSchema = z.looseObject({
    completedItems: z.number().int(),
    totalItems: z.number().int(),
})

export type WorkspaceGoalProgress = z.infer<typeof WorkspaceGoalProgressSchema>

export const WorkspaceGoalSchema = z.looseObject({
    id: z.string(),
    workspaceId: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    deadline: z.string().nullable(),
    isDeleted: z.boolean(),
    projectIds: z.array(z.string()),
    progress: WorkspaceGoalProgressSchema.nullable(),
    creatorUid: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

export type WorkspaceGoal = z.infer<typeof WorkspaceGoalSchema>
