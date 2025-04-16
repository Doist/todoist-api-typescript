import { request, isSuccess } from './restClient'
import { v4 as uuid } from 'uuid'
import { TodoistRequestError } from './types'
import {
    getAuthBaseUri,
    getSyncBaseUri,
    ENDPOINT_AUTHORIZATION,
    ENDPOINT_GET_TOKEN,
    ENDPOINT_REVOKE_TOKEN,
} from './consts/endpoints'

/**
 * Permission scopes that can be requested during OAuth2 authorization.
 * @see {@link https://todoist.com/api/v1/docs#tag/Authorization}
 */
export type Permission =
    | 'task:add'
    | 'data:read'
    | 'data:read_write'
    | 'data:delete'
    | 'project:delete'
    | 'backups:read'

/**
 * Parameters required to exchange an authorization code for an access token.
 * @see https://todoist.com/api/v1/docs#tag/Authorization/OAuth
 */
export type AuthTokenRequestArgs = {
    clientId: string
    clientSecret: string
    code: string
}
/**
 * Response from a successful OAuth2 token exchange.
 * @see https://todoist.com/api/v1/docs#tag/Authorization/OAuth
 */
export type AuthTokenResponse = {
    accessToken: string
    tokenType: string
}

/**
 * Parameters required to revoke an access token.
 * @see https://todoist.com/api/v1/docs#tag/Authorization/operation/revoke_access_token_api_api_v1_access_tokens_delete
 */
export type RevokeAuthTokenRequestArgs = {
    clientId: string
    clientSecret: string
    accessToken: string
}

/**
 * Generates a random state parameter for OAuth2 authorization.
 * The state parameter helps prevent CSRF attacks.
 *
 * @example
 * ```typescript
 * const state = getAuthStateParameter()
 * // Store state in session
 * const authUrl = getAuthorizationUrl(clientId, ['data:read'], state)
 * ```
 *
 * @returns A random UUID v4 string
 */
export function getAuthStateParameter(): string {
    return uuid()
}

/**
 * Generates the authorization URL for the OAuth2 flow.
 *
 * @example
 * ```typescript
 * const url = getAuthorizationUrl(
 *   'your-client-id',
 *   ['data:read', 'task:add'],
 *   state
 * )
 * // Redirect user to url
 * ```
 *
 * @returns The full authorization URL to redirect users to
 * @see https://todoist.com/api/v1/docs#tag/Authorization/OAuth
 */
export function getAuthorizationUrl(
    clientId: string,
    permissions: Permission[],
    state: string,
    baseUrl?: string,
): string {
    if (!permissions?.length) {
        throw new Error('At least one scope value should be passed for permissions.')
    }

    const scope = permissions.join(',')
    return `${getAuthBaseUri(
        baseUrl,
    )}${ENDPOINT_AUTHORIZATION}?client_id=${clientId}&scope=${scope}&state=${state}`
}

/**
 * Exchanges an authorization code for an access token.
 *
 * @example
 * ```typescript
 * const { accessToken } = await getAuthToken({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   code: authCode
 * })
 * ```
 *
 * @returns The access token response
 * @throws {@link TodoistRequestError} If the token exchange fails
 */
export async function getAuthToken(
    args: AuthTokenRequestArgs,
    baseUrl?: string,
): Promise<AuthTokenResponse> {
    const response = await request<AuthTokenResponse>(
        'POST',
        getAuthBaseUri(baseUrl),
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

/**
 * Revokes an access token, making it invalid for future use.
 *
 * @example
 * ```typescript
 * await revokeAuthToken({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   accessToken: token
 * })
 * ```
 *
 * @returns True if revocation was successful
 * @see https://todoist.com/api/v1/docs#tag/Authorization/operation/revoke_access_token_api_api_v1_access_tokens_delete
 */
export async function revokeAuthToken(
    args: RevokeAuthTokenRequestArgs,
    baseUrl?: string,
): Promise<boolean> {
    const response = await request(
        'POST',
        getSyncBaseUri(baseUrl),
        ENDPOINT_REVOKE_TOKEN,
        undefined,
        args,
    )

    return isSuccess(response)
}
