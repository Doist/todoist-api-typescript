import {
    getAuthorizationUrl,
    getAuthToken,
    revokeAuthToken,
    revokeToken,
    Permission,
} from './authentication'
import { server, http, HttpResponse } from './test-utils/msw-setup'
import { assertInstance } from './test-utils/asserts'
import { TodoistRequestError } from './types'
import { getSyncBaseUri } from './consts/endpoints'

describe('authentication', () => {
    describe('getAuthorizationUrl', () => {
        const authUrlTheories = [
            [
                'SomeId',
                'SomeState',
                ['data:read_write'] as Permission[],
                undefined,
                'https://todoist.com/oauth/authorize?client_id=SomeId&scope=data:read_write&state=SomeState',
            ],
            [
                'SomeId',
                'SomeState',
                ['data:read', 'project:delete'] as Permission[],
                undefined,
                'https://todoist.com/oauth/authorize?client_id=SomeId&scope=data:read,project:delete&state=SomeState',
            ],
            [
                'SomeId',
                'SomeState',
                ['data:read_write'] as Permission[],
                'https://staging.todoist.com',
                'https://staging.todoist.com/oauth/authorize?client_id=SomeId&scope=data:read_write&state=SomeState',
            ],
            [
                'SomeId',
                'SomeState',
                ['data:read', 'project:delete'] as Permission[],
                'https://staging.todoist.com',
                'https://staging.todoist.com/oauth/authorize?client_id=SomeId&scope=data:read,project:delete&state=SomeState',
            ],
        ] as const

        test.each(authUrlTheories)(
            'Formatting %p with arguments %p returns %p',
            (clientId, state, permissions, baseUrl, expected) => {
                const url = getAuthorizationUrl({ clientId, permissions, state, baseUrl })
                expect(url).toEqual(expected)
            },
        )

        test('throws error if no permissions requested', () => {
            expect.assertions(1)

            try {
                getAuthorizationUrl({ clientId: 'SomeId', permissions: [], state: 'SomeState' })
            } catch (e: unknown) {
                assertInstance(e, Error)
                expect(e.message).toEqual(
                    'At least one scope value should be passed for permissions.',
                )
            }
        })
    })

    describe('getAuthToken', () => {
        const defaultAuthRequest = {
            clientId: 'SomeId',
            clientSecret: 'ASecret',
            code: 'TheCode',
        }

        const successfulTokenResponse = {
            accessToken: 'AToken',
            tokenType: 'Bearer',
        }

        test('returns values from successful request', async () => {
            server.use(
                http.post('https://todoist.com/oauth/access_token', () => {
                    return HttpResponse.json(successfulTokenResponse, { status: 200 })
                }),
            )

            const tokenResponse = await getAuthToken(defaultAuthRequest)

            expect(tokenResponse).toEqual(successfulTokenResponse)
        })

        test('throws error if non 200 response', async () => {
            const failureStatus = 400
            server.use(
                http.post('https://todoist.com/oauth/access_token', () => {
                    return HttpResponse.json(undefined, { status: failureStatus })
                }),
            )

            expect.assertions(3)

            try {
                await getAuthToken(defaultAuthRequest)
            } catch (e: unknown) {
                assertInstance(e, TodoistRequestError)
                expect(e.message).toEqual('Authentication token exchange failed.')
                expect(e.httpStatusCode).toEqual(failureStatus)
                expect(e.responseData).toBeUndefined()
            }
        })

        test('throws error if token not present in response', async () => {
            const missingTokenResponse = {
                accessToken: undefined,
                tokenType: undefined,
            }

            server.use(
                http.post('https://todoist.com/oauth/access_token', () => {
                    return HttpResponse.json(missingTokenResponse, { status: 200 })
                }),
            )

            expect.assertions(2)

            try {
                await getAuthToken(defaultAuthRequest)
            } catch (e: unknown) {
                assertInstance(e, TodoistRequestError)
                expect(e.message).toEqual('Authentication token exchange failed.')
                expect(e.responseData).toEqual(missingTokenResponse)
            }
        })
    })

    describe('revokeAuthToken', () => {
        const revokeTokenRequest = {
            clientId: 'SomeId',
            clientSecret: 'ASecret',
            accessToken: 'AToken',
        }

        test('returns true when revocation succeeds', async () => {
            server.use(
                http.post(`${getSyncBaseUri()}access_tokens/revoke`, () => {
                    return HttpResponse.json(undefined, { status: 200 })
                }),
            )

            const isSuccess = await revokeAuthToken(revokeTokenRequest)

            expect(isSuccess).toEqual(true)
        })
    })

    describe('revokeToken', () => {
        const revokeTokenRequest = {
            clientId: 'SomeId',
            clientSecret: 'ASecret',
            token: 'AToken',
        }

        test('calls request with RFC 7009 compliant parameters', async () => {
            let capturedHeaders: Record<string, string> = {}
            let capturedBody: unknown = null

            server.use(
                http.post(`${getSyncBaseUri()}revoke`, async ({ request }) => {
                    // Capture headers
                    const headers: Record<string, string> = {}
                    request.headers.forEach((value, key) => {
                        headers[key] = value
                    })
                    capturedHeaders = headers

                    // Capture body
                    capturedBody = await request.json()

                    return HttpResponse.json(undefined, { status: 200 })
                }),
            )

            const isSuccess = await revokeToken(revokeTokenRequest)

            // Verify request body contains only token and token_type_hint
            expect(capturedBody).toEqual({
                token: 'AToken',
                token_type_hint: 'access_token',
            })

            // Verify Basic Auth header is present
            expect(capturedHeaders).toBeDefined()
            expect(capturedHeaders.authorization).toMatch(/^Basic /)

            // Verify Basic Auth is correctly encoded (base64 of "SomeId:ASecret")
            const expectedAuth = Buffer.from('SomeId:ASecret').toString('base64')
            expect(capturedHeaders.authorization).toEqual(`Basic ${expectedAuth}`)

            expect(isSuccess).toEqual(true)
        })

        test('returns true when revocation succeeds', async () => {
            server.use(
                http.post(`${getSyncBaseUri()}revoke`, () => {
                    return HttpResponse.json(undefined, { status: 200 })
                }),
            )

            const result = await revokeToken(revokeTokenRequest)

            expect(result).toBe(true)
        })
    })
})
