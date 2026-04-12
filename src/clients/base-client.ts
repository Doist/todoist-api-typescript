import type { SyncRequestContext } from '../transport/sync-request'
import type { CustomFetch } from '../types/http'

/**
 * Construction parameters shared by every domain sub-client.
 *
 * `TodoistApi` instantiates each sub-client with this record, derived from
 * its own constructor arguments, so sub-clients share the same HTTP identity
 * without each re-deriving it from the original inputs.
 */
export type BaseClientDeps = {
    authToken: string
    syncApiBase: string
    customFetch?: CustomFetch
}

/**
 * Internal base class for every domain sub-client (tasks, projects, …).
 *
 * Not exported from the package — sub-clients are an implementation detail
 * of `TodoistApi`. Holds the three pieces of HTTP identity every sub-client
 * needs and exposes a typed accessor to feed the Sync API helper.
 */
export abstract class BaseClient {
    protected readonly authToken: string
    protected readonly syncApiBase: string
    protected readonly customFetch?: CustomFetch

    constructor(deps: BaseClientDeps) {
        this.authToken = deps.authToken
        this.syncApiBase = deps.syncApiBase
        this.customFetch = deps.customFetch
    }

    protected get syncContext(): SyncRequestContext {
        return {
            authToken: this.authToken,
            syncApiBase: this.syncApiBase,
            customFetch: this.customFetch,
        }
    }
}
