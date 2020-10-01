import { request } from './restClient'
import { v4 as uuid } from 'uuid'
import { TodoistRequestError } from './types'

const authenticationBaseUri = 'https://todoist.com/oauth/'
const authorizationEndpoint = 'authorize'
const authTokenEndpoint = 'access_token'

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

export const getAuthStateParameter = (): string => uuid()

export const getAuthorizationUrl = (
    clientId: string,
    permissions: Permission[],
    state: string,
): string => {
    if (!permissions?.length) {
        throw new Error('At least one scope value should be passed for permissions.')
    }

    const scope = permissions.join(',')
    return `${authenticationBaseUri}${authorizationEndpoint}?client_id=${clientId}&scope=${scope}&state=${state}`
}

export const getAuthToken = async (args: AuthTokenRequestArgs): Promise<AuthTokenResponse> => {
    const response = await request<AuthTokenResponse>(
        'POST',
        authenticationBaseUri,
        authTokenEndpoint,
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
