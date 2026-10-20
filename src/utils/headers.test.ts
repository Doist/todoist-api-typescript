import { mergeHeaders, resolveCustomHeaders } from './headers'

describe('mergeHeaders', () => {
    test('combines headers from every source', () => {
        expect(
            mergeHeaders({ 'Doist-Platform': 'cli' }, { Authorization: 'Bearer token' }),
        ).toEqual({ 'Doist-Platform': 'cli', Authorization: 'Bearer token' })
    })

    test('lets a later source replace an earlier header whatever its case', () => {
        expect(
            mergeHeaders(
                { authorization: 'Bearer forged', 'X-REQUEST-ID': 'forged' },
                { Authorization: 'Bearer token', 'X-Request-Id': 'request-id' },
            ),
        ).toEqual({ Authorization: 'Bearer token', 'X-Request-Id': 'request-id' })
    })

    test('skips undefined sources', () => {
        expect(mergeHeaders(undefined, { Accept: 'text/plain' }, undefined)).toEqual({
            Accept: 'text/plain',
        })
    })
})

describe('resolveCustomHeaders', () => {
    test('returns a record unchanged', () => {
        const headers = { 'Doist-Platform': 'cli' }
        expect(resolveCustomHeaders(headers)).toBe(headers)
    })

    test('calls a function and returns its result', () => {
        expect(resolveCustomHeaders(() => ({ 'Doist-Platform': 'cli' }))).toEqual({
            'Doist-Platform': 'cli',
        })
    })

    test('returns undefined when no headers are configured', () => {
        expect(resolveCustomHeaders(undefined)).toBeUndefined()
    })
})
