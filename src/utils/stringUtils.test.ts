import theoretically from 'jest-theories'
import { formatString, truncate } from './stringUtils'

describe('stringUtils', () => {
    const stringFormatTheories = [
        {
            template: 'Works with number {0}, and bool {1}',
            args: [1, true],
            expected: 'Works with number 1, and bool true',
        },
        {
            template: 'Undefined value removes {0}{1} template',
            args: [undefined, 'the'],
            expected: 'Undefined value removes the template',
        },
        {
            template: 'Too many args ignores {0} extras',
            args: ['the', undefined],
            expected: 'Too many args ignores the extras',
        },
        {
            template: 'Not enough args leaves template in place{0}',
            args: [],
            expected: 'Not enough args leaves template in place{0}',
        },
    ]

    theoretically(
        'Formatting {template} with arguments {args} returns {expected}',
        stringFormatTheories,
        (theory) => {
            const color = formatString(theory.template, ...theory.args)
            expect(color).toEqual(theory.expected)
        },
    )

    const truncationTheories = [
        {
            input: 'x'.repeat(10),
            limit: 10,
            expected: 'x'.repeat(10),
        },
        {
            input: 'x'.repeat(10),
            limit: 5,
            expected: 'x'.repeat(2) + '...',
        },
    ]

    theoretically(
        'truncate {input} results in {expected} when limit is {limit}',
        truncationTheories,
        (theory) => {
            const result = truncate(theory.input, theory.limit)
            expect(result).toEqual(theory.expected)
        },
    )
})
