import { Task } from './entities'

export type Command = {
    type: string
    uuid: string
    args: Record<string, unknown>
}

export type SyncError = {
    error: string
    errorCode: number
    errorExtra: Record<string, unknown>
    errorTag: string
    httpCode: number
}

/**
 * All available Sync API resource types.
 */
export const SYNC_RESOURCE_TYPES = [
    'labels',
    'projects',
    'items',
    'notes',
    'sections',
    'filters',
    'reminders',
    'reminders_location',
    'locations',
    'user',
    'live_notifications',
    'collaborators',
    'user_settings',
    'notification_settings',
    'user_plan_limits',
    'completed_info',
    'stats',
    'workspaces',
    'workspace_users',
    'workspace_filters',
    'view_options',
    'project_view_options_defaults',
    'role_actions',
] as const

export type SyncResourceType = (typeof SYNC_RESOURCE_TYPES)[number]

export type SyncRequest = {
    commands?: Command[]
    resource_types?: SyncResourceType[]
    sync_token?: string
}

export type SyncResponse = {
    items?: Task[]
    syncStatus?: Record<string, 'ok' | SyncError>
    syncToken?: string
    fullSync?: boolean
    workspaces?: Record<string, unknown>
}
