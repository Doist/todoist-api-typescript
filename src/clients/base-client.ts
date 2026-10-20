import type { SyncRequestContext } from '../transport/sync-request'
import type { CustomFetch } from '../types/http'

/**
 * Internal base class for every domain sub-client (tasks, projects, …).
 *
 * Not exported from the package — sub-clients are an implementation detail
 * of `TodoistApi`. Holds the pieces of HTTP identity every sub-client
 * needs and exposes a typed accessor to feed the Sync API helper.
 *
 * The constructor takes a {@link SyncRequestContext} — the same record
 * shape used by `performSyncRequest` — so there is a single type describing
 * "the HTTP identity an SDK component needs", not two types that must stay
 * in sync.
 */
export abstract class BaseClient {
    protected readonly authToken: string
    protected readonly syncApiBase: string
    protected readonly apiRootBase: string
    protected readonly customFetch?: CustomFetch
    protected readonly customHeaders?: Record<string, string>

    constructor(context: SyncRequestContext) {
        this.authToken = context.authToken
        this.syncApiBase = context.syncApiBase
        this.apiRootBase = new URL('/', context.syncApiBase).toString()
        this.customFetch = context.customFetch
        this.customHeaders = context.customHeaders
    }

    protected get syncContext(): SyncRequestContext {
        return {
            authToken: this.authToken,
            syncApiBase: this.syncApiBase,
            customFetch: this.customFetch,
            customHeaders: this.customHeaders,
        }
    }
}
