import type {
    Task,
    Label,
    Section,
    PersonalProject,
    WorkspaceProject,
    WorkspaceUser,
} from '../entities'
import type {
    Filter,
    Collaborator,
    CollaboratorState,
    Folder,
    Note,
    Tooltips,
    WorkspaceFilter,
    WorkspaceGoal,
    Calendar,
    CalendarAccount,
    Reminder,
    CompletedInfo,
    ViewOptions,
    ProjectViewOptionsDefaults,
    UserPlanLimits,
    LiveNotification,
    SyncWorkspace,
} from './resources'

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
    notes?: Note[]
    projectNotes?: Note[]
    filters?: Filter[]
    reminders?: Reminder[]
    remindersLocation?: Record<string, unknown>[]
    locations?: Record<string, unknown>[]
    user?: Record<string, unknown>
    liveNotifications?: LiveNotification[]
    collaborators?: Collaborator[]
    collaboratorStates?: CollaboratorState[]
    userSettings?: Record<string, unknown>
    notificationSettings?: Record<string, unknown>
    userPlanLimits?: UserPlanLimits
    completedInfo?: CompletedInfo[]
    stats?: Record<string, unknown>
    workspaces?: SyncWorkspace[]
    workspaceUsers?: WorkspaceUser[]
    workspaceFilters?: WorkspaceFilter[]
    viewOptions?: ViewOptions[]
    projectViewOptionsDefaults?: ProjectViewOptionsDefaults[]
    roleActions?: Record<string, unknown>[]
    folders?: Folder[]
    workspaceGoals?: WorkspaceGoal[]
    dayOrders?: Record<string, number>
    calendars?: Calendar[]
    calendarAccounts?: CalendarAccount[]
    suggestions?: Record<string, unknown>[]
    tooltips?: Tooltips[]
}
