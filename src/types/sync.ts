import { Task } from './entities'

export type Command = {
    type: string
    uuid: string
    args: Record<string, unknown>
}

export type SyncError = {
    error: string
    error_code: number
    error_extra: Record<string, unknown>
    error_tag: string
    http_code: number
}

export type SyncRequest = {
    commands: Command[]
    resource_types?: string[]
}

export type SyncResponse = {
    items?: Task[]
    sync_status?: Record<string, 'ok' | SyncError>
}
