import { ENDPOINT_REST_PRODUCTIVITY } from '../consts/endpoints'
import { request } from '../transport/http-client'
import type { ProductivityStats } from '../types/productivity'
import { validateProductivityStats } from '../utils/validators'
import { BaseClient } from './base-client'

/**
 * Internal sub-client handling the productivity-stats endpoint.
 *
 * Instantiated by `TodoistApi`; the public `getProductivityStats` method
 * on `TodoistApi` delegates here. See `todoist-api.ts` for user-facing
 * JSDoc.
 */
export class ProductivityClient extends BaseClient {
    async getProductivityStats(): Promise<ProductivityStats> {
        const response = await request<ProductivityStats>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_PRODUCTIVITY,
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })
        return validateProductivityStats(response.data)
    }
}
