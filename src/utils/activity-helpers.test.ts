import { normalizeObjectTypeForApi, denormalizeObjectTypeFromApi } from './activity-helpers'

describe('normalizeObjectTypeForApi', () => {
    test.each([
        ['task', 'item'],
        ['comment', 'note'],
        ['project', 'project'],
        ['unknown_type', 'unknown_type'],
    ])('converts %s to %s', (input, expected) => {
        expect(normalizeObjectTypeForApi(input)).toBe(expected)
    })

    test('handles undefined', () => {
        expect(normalizeObjectTypeForApi(undefined)).toBe(undefined)
    })
})

describe('denormalizeObjectTypeFromApi', () => {
    test.each([
        ['item', 'task'],
        ['note', 'comment'],
        ['project', 'project'],
        ['unknown_type', 'unknown_type'],
    ])('converts %s to %s', (input, expected) => {
        expect(denormalizeObjectTypeFromApi(input)).toBe(expected)
    })

    test('handles undefined', () => {
        expect(denormalizeObjectTypeFromApi(undefined)).toBe(undefined)
    })
})
