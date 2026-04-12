import { ENDPOINT_REST_EMAILS } from '../consts/endpoints'
import { isSuccess, request } from '../transport/http-client'
import type {
    DisableEmailArgs,
    GetOrCreateEmailArgs,
    GetOrCreateEmailResponse,
} from '../types/emails'
import { BaseClient } from './base-client'

/**
 * Internal sub-client handling email-forwarding endpoints.
 *
 * Instantiated by `TodoistApi`; every public email-forwarding method on
 * `TodoistApi` delegates here. See `todoist-api.ts` for user-facing
 * JSDoc.
 */
export class EmailClient extends BaseClient {
    async getOrCreateEmailForwarding(
        args: GetOrCreateEmailArgs,
        requestId?: string,
    ): Promise<GetOrCreateEmailResponse> {
        const { data } = await request<GetOrCreateEmailResponse>({
            httpMethod: 'PUT',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_EMAILS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
        return data
    }

    async disableEmailForwarding(args: DisableEmailArgs, requestId?: string): Promise<boolean> {
        const queryParams = new URLSearchParams({
            obj_type: args.objType,
            obj_id: args.objId,
        })
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: `${ENDPOINT_REST_EMAILS}?${queryParams.toString()}`,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return isSuccess(response)
    }
}
