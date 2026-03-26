import { TodoistArgumentError, TodoistRequestError } from './errors'

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

    test('TodoistArgumentError preserves its class name', () => {
        expect(new TodoistArgumentError('An Error')).toHaveProperty('name', 'TodoistArgumentError')
    })
})
