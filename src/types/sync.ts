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

export type SyncRequest = {
    commands: Command[]
    resource_types?: string[]
}

export type SyncResponse = {
    items?: Task[]
    syncStatus?: Record<string, 'ok' | SyncError>
}
