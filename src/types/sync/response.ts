import type { Task, Label, Section, PersonalProject, WorkspaceProject } from '../entities'

export type SyncError = {
    error: string
    errorCode: number
    errorExtra: Record<string, unknown>
    errorTag: string
    httpCode: number
}

export type SyncResponse = {
    syncToken?: string
    fullSync?: boolean
    syncStatus?: Record<string, 'ok' | SyncError>
    tempIdMapping?: Record<string, string>
    items?: Task[]
    projects?: (PersonalProject | WorkspaceProject)[]
    sections?: Section[]
    labels?: Label[]
    notes?: Record<string, unknown>[]
    projectNotes?: Record<string, unknown>[]
    filters?: Record<string, unknown>[]
    reminders?: Record<string, unknown>[]
    remindersLocation?: Record<string, unknown>[]
    locations?: Record<string, unknown>[]
    user?: Record<string, unknown>
    liveNotifications?: Record<string, unknown>[]
    collaborators?: Record<string, unknown>[]
    collaboratorStates?: Record<string, unknown>[]
    userSettings?: Record<string, unknown>
    notificationSettings?: Record<string, unknown>
    userPlanLimits?: Record<string, unknown>
    completedInfo?: Record<string, unknown>[]
    stats?: Record<string, unknown>
    workspaces?: Record<string, unknown>
    workspaceUsers?: Record<string, unknown>[]
    workspaceFilters?: Record<string, unknown>[]
    viewOptions?: Record<string, unknown>[]
    projectViewOptionsDefaults?: Record<string, unknown>[]
    roleActions?: Record<string, unknown>[]
    folders?: Record<string, unknown>[]
    workspaceGoals?: Record<string, unknown>[]
    dayOrders?: Record<string, number>
    calendars?: Record<string, unknown>[]
    calendarAccounts?: Record<string, unknown>[]
    suggestions?: Record<string, unknown>[]
    tooltips?: Record<string, unknown>[]
}
