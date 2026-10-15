import { TodoistColor } from '@doist/sdk-kmp/shared-todoist-all'
import { berryRed, taupe, getColorByKey, defaultColor, colors } from './colors'

describe('colors', () => {
    test('has the same keys as shared-todoist-all, in the same order', () => {
        expect(colors.map((color) => color.key)).toEqual(
            TodoistColor.values().map((color) => color.key),
        )
    })
})

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
