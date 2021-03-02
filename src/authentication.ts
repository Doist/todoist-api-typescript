import { request, isSuccess } from './restClient'
import { v4 as uuid } from 'uuid'
import { TodoistRequestError } from './types'
import {
    API_AUTHORIZATION_BASE_URI,
    API_SYNC_BASE_URI,
    ENDPOINT_AUTHORIZATION,
    ENDPOINT_GET_TOKEN,
    ENDPOINT_REVOKE_TOKEN,
} from './consts/endpoints'

export type Permission =
    | 'task:add'
    | 'data:read'
    | 'data:read_write'
    | 'data:delete'
    | 'project:delete'

export type AuthTokenResponse = {
    accessToken: string
    state: string
}

export type AuthTokenRequestArgs = {
    clientId: string
    clientSecret: string
    code: string
}

export type RevokeAuthTokenRequestArgs = {
    clientId: string
    clientSecret: string
    accessToken: string
}

export function getAuthStateParameter(): string {
    return uuid()
}

export function getAuthorizationUrl(
    clientId: string,
    permissions: Permission[],
    state: string,
): string {
    if (!permissions?.length) {
        throw new Error('At least one scope value should be passed for permissions.')
    }

    const scope = permissions.join(',')
    return `${API_AUTHORIZATION_BASE_URI}${ENDPOINT_AUTHORIZATION}?client_id=${clientId}&scope=${scope}&state=${state}`
}

export async function getAuthToken(args: AuthTokenRequestArgs): Promise<AuthTokenResponse> {
    const response = await request<AuthTokenResponse>(
        'POST',
        API_AUTHORIZATION_BASE_URI,
        ENDPOINT_GET_TOKEN,
        undefined,
        args,
    )

    if (response.status !== 200 || !response.data?.accessToken) {
        throw new TodoistRequestError(
            'Authentication token exchange failed.',
            response.status,
            response.data,
        )
    }

    return response.data
}

export async function revokeAuthToken(args: RevokeAuthTokenRequestArgs): Promise<boolean> {
    const response = await request(
        'POST',
        API_SYNC_BASE_URI,
        ENDPOINT_REVOKE_TOKEN,
        undefined,
        args,
    )

    return isSuccess(response)
}
