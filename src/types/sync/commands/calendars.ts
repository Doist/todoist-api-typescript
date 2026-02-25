export type CalendarUpdateArgs = {
    id: string
    isVisible: boolean
}

export type CalendarAccountUpdateArgs = {
    id: string
    isEventsEnabled?: boolean
    isTasksEnabled?: boolean
    isAllDayTasksEnabled?: boolean
    pendingOperationUntil?: string | null
}

export type CalendarAccountRestoreTaskCalendarArgs = {
    id: string
}
