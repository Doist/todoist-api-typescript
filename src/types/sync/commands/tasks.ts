import type { SyncDueDate, SyncDeadline, SyncDuration, TaskPriority } from './shared'

export type TaskAddArgs = {
    content: string
    description?: string
    projectId?: string
    due?: SyncDueDate
    deadline?: SyncDeadline
    duration?: SyncDuration
    priority?: TaskPriority
    parentId?: string | null
    childOrder?: number
    sectionId?: string | null
    dayOrder?: number
    isCollapsed?: boolean
    labels?: string[]
    assignedByUid?: string | null
    responsibleUid?: string | null
    autoReminder?: boolean
    autoParseLabels?: boolean
}

export type TaskUpdateArgs = {
    id: string
    content?: string
    description?: string
    due?: SyncDueDate
    deadline?: SyncDeadline
    duration?: SyncDuration
    priority?: TaskPriority
    isCollapsed?: boolean
    labels?: string[]
    assignedByUid?: string | null
    responsibleUid?: string | null
    dayOrder?: number
}

export type TaskCompleteArgs = {
    id: string
    completedAt: string
    forceHistory?: boolean
    fromUndo?: boolean
}

export type TaskCompleteUndoArgs = {
    id: string
    descendants: Array<{ id: string; checked?: boolean }>
}

export type TaskMoveArgs =
    | { id: string; parentId: string | null }
    | { id: string; sectionId: string | null }
    | { id: string; projectId: string }

export type TaskReorderArgs = {
    items: Array<{ id: string; childOrder: number }>
}

export type TaskUncompleteArgs = {
    id: string
}

export type TaskUpdateDateCompleteArgs = {
    id: string
    due: SyncDueDate
    isForward: 0 | 1
    resetSubtasks?: 0 | 1
}

export type TaskDeleteArgs = {
    id: string
}

export type TaskUpdateDayOrderArgs = {
    idsToOrders: Record<string, number | undefined>
}
