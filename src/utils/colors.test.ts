import { getEntityColor } from './colors'
import theoretically from 'jest-theories'

describe('getEntityColor', () => {
    const colorTheories = [
        { colorId: 0, color: '#808080' }, // out of range, defaulted
        { colorId: 30, color: '#b8256f' },
        { colorId: 49, color: '#ccac93' },
        { colorId: 999, color: '#808080' }, // out of range, defaulted
    ]

    theoretically('returns {color} for color id {colorId}', colorTheories, (theory) => {
        const color = getEntityColor(theory.colorId)
        expect(color).toEqual(theory.color)
    })
})
