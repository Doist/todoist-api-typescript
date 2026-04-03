import { z } from 'zod'

export const GOAL_OWNER_TYPES = ['USER', 'WORKSPACE'] as const
export type GoalOwnerType = (typeof GOAL_OWNER_TYPES)[number]

export const GoalProgressSchema = z.object({
    totalItemCount: z.number().int(),
    completedItemCount: z.number().int(),
    percentage: z.number().int(),
})

export const GoalSchema = z.object({
    id: z.string(),
    ownerType: z.enum(GOAL_OWNER_TYPES),
    ownerId: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    deadline: z.string().nullable(),
    parentGoalId: z.string().nullable(),
    childOrder: z.number().int(),
    isCompleted: z.boolean(),
    completedAt: z.string().nullable(),
    responsibleUid: z.string().nullable(),
    isDeleted: z.boolean(),
    progress: GoalProgressSchema,
    creatorUid: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

/**
 * Represents a goal in Todoist.
 * Goals support dual ownership: personal (ownerType=USER) and workspace (ownerType=WORKSPACE).
 */
export type Goal = z.infer<typeof GoalSchema>

export type GoalProgress = z.infer<typeof GoalProgressSchema>
