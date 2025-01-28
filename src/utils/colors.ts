import { Color } from '../types'

export const berryRed: Color = {
    id: 30,
    key: 'berry_red',
    displayName: 'Berry Red',
    name: 'Berry Red',
    hexValue: '#b8255f',
    value: '#b8255f',
} as const
export const red: Color = {
    id: 31,
    key: 'red',
    displayName: 'Red',
    name: 'Red',
    hexValue: '#db4035',
    value: '#db4035',
} as const
export const orange: Color = {
    id: 32,
    key: 'orange',
    displayName: 'Orange',
    name: 'Orange',
    hexValue: '#ff9933',
    value: '#ff9933',
} as const
export const yellow: Color = {
    id: 33,
    key: 'yellow',
    displayName: 'Yellow',
    name: 'Yellow',
    hexValue: '#fad000',
    value: '#fad000',
} as const
export const oliveGreen: Color = {
    id: 34,
    key: 'olive_green',
    displayName: 'Olive Green',
    name: 'Olive Green',
    hexValue: '#afb83b',
    value: '#afb83b',
} as const
export const limeGreen: Color = {
    id: 35,
    key: 'lime_green',
    displayName: 'Lime Green',
    name: 'Lime Green',
    hexValue: '#7ecc49',
    value: '#7ecc49',
} as const
export const green: Color = {
    id: 36,
    key: 'green',
    displayName: 'Green',
    name: 'Green',
    hexValue: '#299438',
    value: '#299438',
} as const
export const mintGreen: Color = {
    id: 37,
    key: 'mint_green',
    displayName: 'Mint Green',
    name: 'Mint Green',
    hexValue: '#6accbc',
    value: '#6accbc',
} as const
export const turquoise: Color = {
    id: 38,
    key: 'turquoise',
    displayName: 'Turquoise',
    name: 'Turquoise',
    hexValue: '#158fad',
    value: '#158fad',
} as const
export const skyBlue: Color = {
    id: 39,
    key: 'sky_blue',
    displayName: 'Sky Blue',
    name: 'Sky Blue',
    hexValue: '#14aaf5',
    value: '#14aaf5',
} as const
export const lightBlue: Color = {
    id: 40,
    key: 'light_blue',
    displayName: 'Light Blue',
    name: 'Light Blue',
    hexValue: '#96c3eb',
    value: '#96c3eb',
} as const
export const blue: Color = {
    id: 41,
    key: 'blue',
    displayName: 'Blue',
    name: 'Blue',
    hexValue: '#4073ff',
    value: '#4073ff',
} as const
export const grape: Color = {
    id: 42,
    key: 'grape',
    displayName: 'Grape',
    name: 'Grape',
    hexValue: '#884dff',
    value: '#884dff',
} as const
export const violet: Color = {
    id: 43,
    key: 'violet',
    displayName: 'Violet',
    name: 'Violet',
    hexValue: '#af38eb',
    value: '#af38eb',
} as const
export const lavender: Color = {
    id: 44,
    key: 'lavender',
    displayName: 'Lavender',
    name: 'Lavender',
    hexValue: '#eb96eb',
    value: '#eb96eb',
} as const
export const magenta: Color = {
    id: 45,
    key: 'magenta',
    displayName: 'Magenta',
    name: 'Magenta',
    hexValue: '#e05194',
    value: '#e05194',
} as const
export const salmon: Color = {
    id: 46,
    key: 'salmon',
    displayName: 'Salmon',
    name: 'Salmon',
    hexValue: '#ff8d85',
    value: '#ff8d85',
} as const
export const charcoal: Color = {
    id: 47,
    key: 'charcoal',
    displayName: 'Charcoal',
    name: 'Charcoal',
    hexValue: '#808080',
    value: '#808080',
} as const
export const gray: Color = {
    id: 48,
    key: 'gray',
    displayName: 'Gray',
    name: 'Gray',
    hexValue: '#b8b8b8',
    value: '#b8b8b8',
} as const
export const taupe: Color = {
    id: 49,
    key: 'taupe',
    displayName: 'Taupe',
    name: 'Taupe',
    hexValue: '#ccac93',
    value: '#ccac93',
} as const

export const colors = [
    berryRed,
    red,
    orange,
    yellow,
    oliveGreen,
    limeGreen,
    green,
    mintGreen,
    turquoise,
    skyBlue,
    lightBlue,
    blue,
    grape,
    violet,
    lavender,
    magenta,
    salmon,
    charcoal,
    gray,
    taupe,
] as const

export const defaultColor: Color = charcoal

/**
 * @private
 * @deprecated Use {@link getColorByKey} instead
 */
export function getColorById(colorId: number): Color {
    const color = colors.find((color) => color.id === colorId)
    return color ?? defaultColor
}

/**
 * @private
 * @deprecated Use {@link getColorByKey} instead
 */
export function getColorByName(colorName: string): Color {
    const color = colors.find((color) => color.name === colorName)
    return color ?? defaultColor
}

/**
 * Retrieves a {@link Color} object by its key identifier.
 *
 * @param colorKey - The unique key identifier of the color to find (e.g., 'berry_red', 'sky_blue')
 * @returns The matching Color object if found, otherwise returns the default color (charcoal)
 *
 * @example
 * ```typescript
 * const color = getColorByKey('berry_red');
 * console.log(color.hexValue); // '#b8255f'
 * ```
 */
export function getColorByKey(colorKey: string): Color {
    const color = colors.find((color) => color.key === colorKey)
    return color ?? defaultColor
}
