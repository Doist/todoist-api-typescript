import { customCamelCase } from './processing-helpers'

describe('Processing helpers', () => {
    describe('customCamelCase', () => {
        test('returns the converted input if it is not an emoji', () => {
            const input = 'hello_there'
            const result = customCamelCase(input)

            expect(result).toBe('helloThere')
        })

        test('returns the input if it is an emoji', () => {
            const input = '👍'
            const result = customCamelCase(input)

            expect(result).toBe(input)
        })
    })
})
