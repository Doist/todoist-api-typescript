import type { SearchArgs } from '../common'
import type { Goal } from './types'

export type GetGoalsArgs = {
    ownerType?: string
    cursor?: string | null
    limit?: number
}

export type SearchGoalsArgs = SearchArgs & {
    ownerType?: string
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
