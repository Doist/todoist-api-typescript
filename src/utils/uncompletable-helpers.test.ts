import {
    addUncompletablePrefix,
    removeUncompletablePrefix,
    hasUncompletablePrefix,
    processTaskContent,
} from './uncompletable-helpers'

describe('uncompletable-helpers', () => {
    describe('addUncompletablePrefix', () => {
        test('adds prefix to content without prefix', () => {
            expect(addUncompletablePrefix('Task content')).toBe('* Task content')
        })

        test('does not add prefix if already present', () => {
            expect(addUncompletablePrefix('* Already prefixed')).toBe('* Already prefixed')
        })

        test('handles empty string', () => {
            expect(addUncompletablePrefix('')).toBe('* ')
        })

        test('handles content with just asterisk (no space)', () => {
            expect(addUncompletablePrefix('*No space')).toBe('* *No space')
        })

        test('handles content with multiple asterisks', () => {
            expect(addUncompletablePrefix('** Bold text')).toBe('* ** Bold text')
        })
    })

    describe('removeUncompletablePrefix', () => {
        test('removes prefix from content with prefix', () => {
            expect(removeUncompletablePrefix('* Task content')).toBe('Task content')
        })

        test('does not modify content without prefix', () => {
            expect(removeUncompletablePrefix('Regular task')).toBe('Regular task')
        })

        test('handles content with just prefix', () => {
            expect(removeUncompletablePrefix('* ')).toBe('')
        })

        test('does not remove asterisk without space', () => {
            expect(removeUncompletablePrefix('*No space')).toBe('*No space')
        })

        test('handles content with multiple prefixes', () => {
            expect(removeUncompletablePrefix('* * Double prefix')).toBe('* Double prefix')
        })
    })

    describe('hasUncompletablePrefix', () => {
        test('returns true for content with prefix', () => {
            expect(hasUncompletablePrefix('* Task content')).toBe(true)
        })

        test('returns false for content without prefix', () => {
            expect(hasUncompletablePrefix('Regular task')).toBe(false)
        })

        test('returns false for asterisk without space', () => {
            expect(hasUncompletablePrefix('*No space')).toBe(false)
        })

        test('returns true for just the prefix', () => {
            expect(hasUncompletablePrefix('* ')).toBe(true)
        })

        test('returns false for empty string', () => {
            expect(hasUncompletablePrefix('')).toBe(false)
        })
    })

    describe('processTaskContent', () => {
        describe('content prefix takes precedence', () => {
            test('preserves existing prefix even when isUncompletable is false', () => {
                expect(processTaskContent('* Existing prefix', false)).toBe('* Existing prefix')
            })

            test('preserves existing prefix when isUncompletable is true', () => {
                expect(processTaskContent('* Existing prefix', true)).toBe('* Existing prefix')
            })

            test('preserves existing prefix when isUncompletable is undefined', () => {
                expect(processTaskContent('* Existing prefix')).toBe('* Existing prefix')
            })
        })

        describe('adds prefix when requested and not present', () => {
            test('adds prefix when isUncompletable is true', () => {
                expect(processTaskContent('Regular task', true)).toBe('* Regular task')
            })

            test('does not add prefix when isUncompletable is false', () => {
                expect(processTaskContent('Regular task', false)).toBe('Regular task')
            })

            test('does not add prefix when isUncompletable is undefined', () => {
                expect(processTaskContent('Regular task')).toBe('Regular task')
            })
        })

        describe('edge cases', () => {
            test('handles empty string with isUncompletable true', () => {
                expect(processTaskContent('', true)).toBe('* ')
            })

            test('handles empty string with isUncompletable false', () => {
                expect(processTaskContent('', false)).toBe('')
            })

            test('handles content with asterisk but no space', () => {
                expect(processTaskContent('*Bold text', true)).toBe('* *Bold text')
            })

            test('handles content with multiple asterisks', () => {
                expect(processTaskContent('**Important task**', true)).toBe('* **Important task**')
            })

            test('handles content starting with space', () => {
                expect(processTaskContent(' Indented task', true)).toBe('*  Indented task')
            })
        })
    })

    describe('integration test cases', () => {
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
