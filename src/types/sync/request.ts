import type { SyncCommand } from './commands'
import type { SyncResourceType } from './resource-types'

export type SyncRequest = {
    commands?: SyncCommand[]
    resourceTypes?: SyncResourceType[]
    syncToken?: string
}
