import { ENDPOINT_REST_FILTERS } from '../consts/endpoints'
import { isSuccess, request } from '../transport/http-client'
import { generatePath } from '../utils/request-helpers'
import { IdSchema } from '../utils/validators'
import { BaseClient } from './base-client'

/**
 * Internal sub-client handling all filter-domain endpoints.
 *
 * Instantiated by `TodoistApi`; every public filter method on `TodoistApi`
 * delegates here. See `todoist-api.ts` for the user-facing JSDoc.
 */
export class FilterClient extends BaseClient {
    async deleteFilter(id: string, requestId?: string): Promise<boolean> {
        IdSchema.parse(id)
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_FILTERS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return isSuccess(response)
    }
}
