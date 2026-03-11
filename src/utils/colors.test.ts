import { berryRed, taupe, getColorByKey, defaultColor } from './colors'

describe('getColorByKey', () => {
    const colorTheories = [
        ['berry_red', berryRed],
        ['taupe', taupe],
        ['Berry Red', defaultColor], // does not exist, defaulted
        ['Some non existing color', defaultColor], // does not exist, defaulted
    ] as const

    test.each(colorTheories)('key %p returns color %p', (key, expected) => {
        const color = getColorByKey(key)
        expect(color).toEqual(expected)
    })
})
