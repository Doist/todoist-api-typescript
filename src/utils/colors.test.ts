import {
    berryRed,
    charcoal,
    taupe,
    getColorById,
    getColorByName,
    getColorByInternalName,
} from './colors'

describe('getColorById', () => {
    const colorTheories = [
        [0, charcoal], // out of range, defaulted
        [30, berryRed],
        [49, taupe],
        [999, charcoal], // out of range, defaulted
    ] as const

    test.each(colorTheories)('id %p returns color %p', (id, expected) => {
        const color = getColorById(id)
        expect(color).toEqual(expected)
    })
})

describe('getColorByName', () => {
    const colorTheories = [
        ['Berry Red', berryRed],
        ['Taupe', taupe],
        ['Some non existing color', charcoal], // does not exist, defaulted
    ] as const

    test.each(colorTheories)('name %p returns color %p', (name, expected) => {
        const color = getColorByName(name)
        expect(color).toEqual(expected)
    })
})

describe('getColorByInternalName', () => {
    const colorTheories = [
        ['berry_red', berryRed],
        ['taupe', taupe],
        ['Berry Red', charcoal], // does not exist, defaulted
        ['Some non existing color', charcoal], // does not exist, defaulted
    ] as const

    test.each(colorTheories)('internalName %p returns color %p', (internalName, expected) => {
        const color = getColorByInternalName(internalName)
        expect(color).toEqual(expected)
    })
})
