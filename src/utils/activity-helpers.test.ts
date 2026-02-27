import {
    normalizeObjectTypeForApi,
    denormalizeObjectTypeFromApi,
    normalizeObjectEventTypeForApi,
} from './activity-helpers'

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

describe('normalizeObjectEventTypeForApi', () => {
    test.each([
        ['task:added', 'item:added'],
        ['comment:added', 'note:added'],
        ['task:', 'item:'],
        ['comment:', 'note:'],
        [':deleted', ':deleted'],
        ['project:updated', 'project:updated'],
        ['unknown:event', 'unknown:event'],
        // no-colon edge case: treat whole string as object type
        ['task', 'item'],
        ['comment', 'note'],
        ['project', 'project'],
    ])('converts %s to %s', (input, expected) => {
        expect(normalizeObjectEventTypeForApi(input)).toBe(expected)
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
