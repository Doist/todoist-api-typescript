import {
    getAuthorizationUrl,
    getAuthToken,
    revokeAuthToken,
    revokeToken,
    Permission,
} from './authentication'
import { setupRestClientMock } from './testUtils/mocks'
import { assertInstance } from './testUtils/asserts'
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
                const url = getAuthorizationUrl(clientId, permissions, state, baseUrl)
                expect(url).toEqual(expected)
            },
        )

        test('throws error if no permissions requested', () => {
            expect.assertions(1)

            try {
                getAuthorizationUrl('SomeId', [], 'SomeState')
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

        test('calls request with expected values', async () => {
            const requestMock = setupRestClientMock(successfulTokenResponse)

            await getAuthToken(defaultAuthRequest)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'POST',
                'https://todoist.com/oauth/',
                'access_token',
                undefined,
                defaultAuthRequest,
            )
        })

        test('returns values from successful request', async () => {
            setupRestClientMock(successfulTokenResponse)

            const tokenResponse = await getAuthToken(defaultAuthRequest)

            expect(tokenResponse).toEqual(successfulTokenResponse)
        })

        test('throws error if non 200 response', async () => {
            const failureStatus = 400
            setupRestClientMock(undefined, failureStatus)

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

            setupRestClientMock(missingTokenResponse)

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

        test('calls request with expected values', async () => {
            const requestMock = setupRestClientMock(undefined, 200)

            const isSuccess = await revokeAuthToken(revokeTokenRequest)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'POST',
                getSyncBaseUri(),
                'access_tokens/revoke',
                undefined,
                revokeTokenRequest,
            )
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
            const requestMock = setupRestClientMock(undefined, 200)

            const isSuccess = await revokeToken(revokeTokenRequest)

            expect(requestMock).toHaveBeenCalledTimes(1)

            // Verify the correct endpoint is called
            const callArgs = requestMock.mock.calls[0]
            expect(callArgs[0]).toEqual('POST')
            expect(callArgs[1]).toEqual(getSyncBaseUri())
            expect(callArgs[2]).toEqual('revoke')

            // Verify no API token is passed (should be undefined)
            expect(callArgs[3]).toBeUndefined()

            // Verify request body contains only token and token_type_hint
            expect(callArgs[4]).toEqual({
                token: 'AToken',
                token_type_hint: 'access_token',
            })

            // Verify Basic Auth header is present
            const customHeaders = callArgs[7]
            expect(customHeaders).toBeDefined()
            expect(customHeaders?.Authorization).toMatch(/^Basic /)

            // Verify Basic Auth is correctly encoded (base64 of "SomeId:ASecret")
            const expectedAuth = Buffer.from('SomeId:ASecret').toString('base64')
            expect(customHeaders?.Authorization).toEqual(`Basic ${expectedAuth}`)

            expect(isSuccess).toEqual(true)
        })

        test('returns true when revocation succeeds', async () => {
            setupRestClientMock(undefined, 200)

            const result = await revokeToken(revokeTokenRequest)

            expect(result).toBe(true)
        })
    })
})
