import { getAuthorizationUrl, getAuthToken, revokeAuthToken, Permission } from './authentication'
import { setupRestClientMock } from './testUtils/mocks'
import { assertInstance } from './testUtils/asserts'
import { TodoistRequestError } from './types'

describe('authentication', () => {
    describe('getAuthorizationUrl', () => {
        const authUrlTheories = [
            [
                'SomeId',
                'SomeState',
                ['data:read_write'] as Permission[],
                'https://todoist.com/oauth/authorize?client_id=SomeId&scope=data:read_write&state=SomeState',
            ],
            [
                'SomeId',
                'SomeState',
                ['data:read', 'project:delete'] as Permission[],
                'https://todoist.com/oauth/authorize?client_id=SomeId&scope=data:read,project:delete&state=SomeState',
            ],
        ] as const

        test.each(authUrlTheories)(
            'Formatting %p with arguments %p returns %p',
            (clientId, state, permissions, expected) => {
                const url = getAuthorizationUrl(clientId, permissions, state)
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
            state: 'AState',
        }

        test('calls request with expected values', async () => {
            const requestMock = setupRestClientMock(successfulTokenResponse)

            await getAuthToken(defaultAuthRequest)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
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
                state: 'AState',
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

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                'https://api.todoist.com/sync/v8/',
                'access_tokens/revoke',
                undefined,
                revokeTokenRequest,
            )
            expect(isSuccess).toEqual(true)
        })
    })
})
