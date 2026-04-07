import { z } from 'zod'

/** Available goal owner types. */
export const GOAL_OWNER_TYPES = ['USER', 'WORKSPACE'] as const
/** Goal owner type. */
export type GoalOwnerType = (typeof GOAL_OWNER_TYPES)[number]

export const GoalProgressSchema = z.looseObject({
    totalItemCount: z.number().int(),
    completedItemCount: z.number().int(),
    percentage: z.number(),
})

export type GoalProgress = z.infer<typeof GoalProgressSchema>

export const GoalSchema = z.looseObject({
    id: z.string(),
    ownerType: z.enum(GOAL_OWNER_TYPES),
    ownerId: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    deadline: z.string().nullable(),
    parentGoalId: z.string().nullable(),
    childOrder: z.number().int(),
    isCompleted: z.boolean(),
    completedAt: z.coerce.date().nullable(),
    responsibleUid: z.string().nullable(),
    isDeleted: z.boolean(),
    progress: GoalProgressSchema.optional(),
    creatorUid: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

/**
 * Represents a goal in Todoist.
 * Goals support dual ownership: personal (ownerType=USER) and workspace (ownerType=WORKSPACE).
 */
export type Goal = z.infer<typeof GoalSchema>
