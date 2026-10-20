import { mergeHeaders } from './headers'

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
