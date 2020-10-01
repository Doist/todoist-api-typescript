import { TodoistRequestError } from './errors'

describe('errors', () => {
    const isAuthenticationErrorTheories = [
        [undefined, false],
        [200, false],
        [401, true],
        [403, true],
        [500, false],
    ] as const

    test.each(isAuthenticationErrorTheories)(
        'TodoistRequestError for status code %p reports isAuthenticationError = %p',
        (statusCode, isAuthenticationError) => {
            const requestError = new TodoistRequestError('An Error', statusCode, undefined)
            expect(requestError.isAuthenticationError()).toEqual(isAuthenticationError)
        },
    )
})
