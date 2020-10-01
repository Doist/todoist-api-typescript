import { getColor, berryRed, charcoal, taupe } from './colors'

describe('getColor', () => {
    const colorTheories = [
        [0, charcoal], // out of range, defaulted
        [30, berryRed],
        [49, taupe],
        [999, charcoal], // out of range, defaulted
    ] as const

    test.each(colorTheories)('id %p returns color %p', (id, expected) => {
        const color = getColor(id)
        expect(color).toEqual(expected)
    })
})
