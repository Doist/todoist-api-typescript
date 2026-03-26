/**
 * Shared types used across multiple Sync API command argument types.
 */

/**
 * Due date for Sync API create/update operations.
 * Unlike the REST API `DueDate` (which has required fields on responses),
 * this type represents the input shape where all fields are optional.
 */
export type SyncDueDate = {
    date?: string
    string?: string
    timezone?: string | null
    lang?: string
    isRecurring?: boolean
} | null

/**
 * Deadline for Sync API create/update operations.
 * Unlike the REST API `Deadline` (which requires `lang`),
 * this type makes `lang` optional for input.
 */
export type SyncDeadline = {
    date: string
    lang?: string
} | null

/**
 * Duration for Sync API create/update operations.
 */
export type SyncDuration = {
    amount: number
    unit: string
} | null

/** Task priority: 1 = normal, 2 = medium, 3 = high, 4 = urgent. */
export type TaskPriority = 1 | 2 | 3 | 4

/** Available project workflow statuses. */
export const PROJECT_STATUSES = [
    'PLANNED',
    'IN_PROGRESS',
    'PAUSED',
    'COMPLETED',
    'CANCELED',
] as const
/** Project workflow status. */
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export { COLLABORATOR_ROLES, type CollaboratorRole } from '../../entities'

/** Available reminder notification services. */
export const REMINDER_SERVICES = ['default', 'email', 'mobile', 'push', 'no_default'] as const
/** Reminder notification service. */
export type ReminderService = (typeof REMINDER_SERVICES)[number]

/**
 * Default access level for workspaces.
 * Same values as {@link ProjectVisibility} from entities.
 */
export { type ProjectVisibility as DefaultAccessLevel } from '../../entities'

/** Available workspace project sort orders. */
export const WORKSPACE_PROJECT_SORT_ORDERS = ['MANUAL', 'A_TO_Z', 'Z_TO_A'] as const
/** Workspace project sort order preference. */
export type WorkspaceProjectSortOrder = (typeof WORKSPACE_PROJECT_SORT_ORDERS)[number]
