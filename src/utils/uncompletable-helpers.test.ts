import {
    addUncompletablePrefix,
    removeUncompletablePrefix,
    hasUncompletablePrefix,
    processTaskContent,
} from './uncompletable-helpers'

describe('uncompletable-helpers', () => {
    describe('addUncompletablePrefix', () => {
        test.each([
            ['Task content', '* Task content'],
            ['* Already prefixed', '* Already prefixed'],
            ['', '* '],
            ['*No space', '* *No space'],
            ['** Bold text', '* ** Bold text'],
        ])('transforms "%s" to "%s"', (input, expected) => {
            expect(addUncompletablePrefix(input)).toBe(expected)
        })
    })

    describe('removeUncompletablePrefix', () => {
        test.each([
            ['* Task content', 'Task content'],
            ['Regular task', 'Regular task'],
            ['* ', ''],
            ['*No space', '*No space'],
            ['* * Double prefix', '* Double prefix'],
        ])('transforms "%s" to "%s"', (input, expected) => {
            expect(removeUncompletablePrefix(input)).toBe(expected)
        })
    })

    describe('hasUncompletablePrefix', () => {
        test.each([
            ['* Task content', true],
            ['Regular task', false],
            ['*No space', false],
            ['* ', true],
            ['', false],
        ])('returns %s for input "%s"', (input, expected) => {
            expect(hasUncompletablePrefix(input)).toBe(expected)
        })
    })

    describe('processTaskContent', () => {
        const testCases = [
            // Content prefix takes precedence
            {
                input: '* Task content',
                isUncompletable: false,
                expected: '* Task content',
                description: 'prefix wins over false flag',
            },
            {
                input: '* Task content',
                isUncompletable: true,
                expected: '* Task content',
                description: 'prefix preserved with true flag',
            },
            {
                input: '* Task content',
                isUncompletable: undefined,
                expected: '* Task content',
                description: 'prefix preserved with undefined flag',
            },

            // Add prefix when requested
            {
                input: 'Task content',
                isUncompletable: true,
                expected: '* Task content',
                description: 'adds prefix when requested',
            },
            {
                input: 'Task content',
                isUncompletable: false,
                expected: 'Task content',
                description: 'no prefix when false',
            },
            {
                input: 'Task content',
                isUncompletable: undefined,
                expected: 'Task content',
                description: 'no prefix when undefined',
            },

            // Edge cases
            {
                input: '',
                isUncompletable: true,
                expected: '* ',
                description: 'empty string with true',
            },
            {
                input: '',
                isUncompletable: false,
                expected: '',
                description: 'empty string with false',
            },
            {
                input: '*No space',
                isUncompletable: true,
                expected: '* *No space',
                description: 'asterisk without space',
            },
            {
                input: '**Bold**',
                isUncompletable: true,
                expected: '* **Bold**',
                description: 'formatting preserved',
            },
        ]

        test.each(testCases)('$description', ({ input, isUncompletable, expected }) => {
            expect(processTaskContent(input, isUncompletable)).toBe(expected)
        })
    })
})
