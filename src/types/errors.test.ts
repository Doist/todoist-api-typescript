import { TodoistRequestError } from './errors'
import theoretically from 'jest-theories'

describe('errors', () => {
    const isAuthenticationErrorTheories = [
        { statusCode: undefined, isAuthenticationError: false },
        { statusCode: 200, isAuthenticationError: false },
        { statusCode: 401, isAuthenticationError: true },
        { statusCode: 403, isAuthenticationError: true },
        { statusCode: 500, isAuthenticationError: false },
    ]

    theoretically(
        'TodoistRequestError reports isAuthenticationError = {isAuthenticationError} for status code {statusCode}',
        isAuthenticationErrorTheories,
        async (theory) => {
            const requestError = new TodoistRequestError('An Error', theory.statusCode, undefined)
            expect(requestError.isAuthenticationError()).toEqual(theory.isAuthenticationError)
        },
    )
})
