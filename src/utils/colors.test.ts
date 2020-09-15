import { getColor, berryRed, charcoal, taupe } from './colors'
import theoretically from 'jest-theories'

describe('getColor', () => {
    const colorTheories = [
        { colorId: 0, color: charcoal }, // out of range, defaulted
        { colorId: 30, color: berryRed },
        { colorId: 49, color: taupe },
        { colorId: 999, color: charcoal }, // out of range, defaulted
    ]

    theoretically('returns {color} for color id {colorId}', colorTheories, (theory) => {
        const color = getColor(theory.colorId)
        expect(color).toEqual(theory.color)
    })
})
