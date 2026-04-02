import type { SearchArgs } from '../common'
import type { Goal, GoalOwnerType } from './types'

export type GetGoalsArgs = {
    ownerType?: GoalOwnerType
    cursor?: string | null
    limit?: number
}

export type SearchGoalsArgs = SearchArgs & {
    ownerType?: GoalOwnerType
}

export type GetGoalsResponse = {
    results: Goal[]
    nextCursor: string | null
}

export type AddGoalArgs = {
    name: string
    workspaceId?: string
    description?: string | null
    deadline?: string | null
    responsibleUid?: string | null
}

export type UpdateGoalArgs = {
    name?: string
    description?: string | null
    deadline?: string | null
    responsibleUid?: string | null
}
