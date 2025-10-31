import { request, isSuccess } from './rest-client'
import { v4 as uuid } from 'uuid'
import { TodoistRequestError } from './types'
import {
    getAuthBaseUri,
    getSyncBaseUri,
    ENDPOINT_AUTHORIZATION,
    ENDPOINT_GET_TOKEN,
    ENDPOINT_REVOKE_TOKEN,
    ENDPOINT_REVOKE,
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
 * Parameters required to revoke a token using RFC 7009 compliant endpoint.
 * @see https://todoist.com/api/v1/docs#tag/Authorization
 */
export type RevokeTokenRequestArgs = {
    clientId: string
    clientSecret: string
    token: string
}

/**
 * Creates a Basic Authentication header value from client credentials.
 * @param clientId - The OAuth client ID
 * @param clientSecret - The OAuth client secret
 * @returns The Basic Auth header value (without the 'Basic ' prefix)
 */
function createBasicAuthHeader(clientId: string, clientSecret: string): string {
    const credentials = `${clientId}:${clientSecret}`
    return Buffer.from(credentials).toString('base64')
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
export function getAuthorizationUrl({
    clientId,
    permissions,
    state,
    baseUrl,
}: {
    clientId: string
    permissions: Permission[]
    state: string
    baseUrl?: string
}): string {
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
    const response = await request<AuthTokenResponse>({
        httpMethod: 'POST',
        baseUri: getAuthBaseUri(baseUrl),
        relativePath: ENDPOINT_GET_TOKEN,
        apiToken: undefined,
        payload: args,
    })

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
 * @deprecated Use {@link revokeToken} instead. This function uses a legacy endpoint that will be removed in a future version. The new function uses the RFC 7009 compliant endpoint.
 * @returns True if revocation was successful
 * @see https://todoist.com/api/v1/docs#tag/Authorization/operation/revoke_access_token_api_api_v1_access_tokens_delete
 */
export async function revokeAuthToken(
    args: RevokeAuthTokenRequestArgs,
    baseUrl?: string,
): Promise<boolean> {
    const response = await request({
        httpMethod: 'POST',
        baseUri: getSyncBaseUri(baseUrl),
        relativePath: ENDPOINT_REVOKE_TOKEN,
        apiToken: undefined,
        payload: args,
    })

    return isSuccess(response)
}

/**
 * Revokes a token using the RFC 7009 OAuth 2.0 Token Revocation standard.
 *
 * This function uses HTTP Basic Authentication with client credentials and follows
 * the RFC 7009 specification for token revocation.
 *
 * @example
 * ```typescript
 * await revokeToken({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   token: 'access-token-to-revoke'
 * })
 * ```
 *
 * @returns True if revocation was successful
 * @see https://datatracker.ietf.org/doc/html/rfc7009
 * @see https://todoist.com/api/v1/docs#tag/Authorization
 */
export async function revokeToken(
    args: RevokeTokenRequestArgs,
    baseUrl?: string,
): Promise<boolean> {
    const { clientId, clientSecret, token } = args

    // Create Basic Auth header as per RFC 7009
    const basicAuth = createBasicAuthHeader(clientId, clientSecret)
    const customHeaders = {
        Authorization: `Basic ${basicAuth}`,
    }

    // Request body only contains the token and optional token_type_hint
    const requestBody = {
        token,
        token_type_hint: 'access_token',
    }

    const response = await request({
        httpMethod: 'POST',
        baseUri: getSyncBaseUri(baseUrl),
        relativePath: ENDPOINT_REVOKE,
        apiToken: undefined,
        payload: requestBody,
        requestId: undefined,
        hasSyncCommands: false,
        customHeaders: customHeaders,
    })

    return isSuccess(response)
}
