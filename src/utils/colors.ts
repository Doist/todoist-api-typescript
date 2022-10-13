import { Color } from '../types'

export const berryRed: Color = {
    name: 'Berry Red',
    internalName: 'berry_red',
    id: 30,
    value: '#b8255f',
}
export const red: Color = { name: 'Red', internalName: 'red', id: 31, value: '#db4035' }
export const orange: Color = { name: 'Orange', internalName: 'orange', id: 32, value: '#ff9933' }
export const yellow: Color = { name: 'Yellow', internalName: 'yellow', id: 33, value: '#fad000' }
export const oliveGreen: Color = {
    name: 'Olive Green',
    internalName: 'olive_green',
    id: 34,
    value: '#afb83b',
}
export const limeGreen: Color = {
    name: 'Lime Green',
    internalName: 'lime_green',
    id: 35,
    value: '#7ecc49',
}
export const green: Color = { name: 'Green', internalName: 'green', id: 36, value: '#299438' }
export const mintGreen: Color = {
    name: 'Mint Green',
    internalName: 'mint_green',
    id: 37,
    value: '#6accbc',
}
export const turquoise: Color = {
    name: 'Turquoise',
    internalName: 'turquoise',
    id: 38,
    value: '#158fad',
}
export const skyBlue: Color = {
    name: 'Sky Blue',
    internalName: 'sky_blue',
    id: 39,
    value: '#14aaf5',
}
export const lightBlue: Color = {
    name: 'Light Blue',
    internalName: 'light_blue',
    id: 40,
    value: '#96c3eb',
}
export const blue: Color = { name: 'Blue', internalName: 'blue', id: 41, value: '#4073ff' }
export const grape: Color = { name: 'Grape', internalName: 'grape', id: 42, value: '#884dff' }
export const violet: Color = { name: 'Violet', internalName: 'violet', id: 43, value: '#af38eb' }
export const lavender: Color = {
    name: 'Lavender',
    internalName: 'lavender',
    id: 44,
    value: '#eb96eb',
}
export const magenta: Color = { name: 'Magenta', internalName: 'magenta', id: 45, value: '#e05194' }
export const salmon: Color = { name: 'Salmon', internalName: 'salmon', id: 46, value: '#ff8d85' }
export const charcoal: Color = {
    name: 'Charcoal',
    internalName: 'charcoal',
    id: 47,
    value: '#808080',
}
export const gray: Color = { name: 'Gray', internalName: 'gray', id: 48, value: '#b8b8b8' }
export const taupe: Color = { name: 'Taupe', internalName: 'taupe', id: 49, value: '#ccac93' }

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
]

export const defaultColor: Color = charcoal

export function getColorById(colorId: number): Color {
    const color = colors.find((color) => color.id === colorId)
    return color ?? defaultColor
}

export function getColorByName(colorName: string): Color {
    const color = colors.find((color) => color.name === colorName)
    return color ?? defaultColor
}

export function getColorByKey(colorInternalName: string): Color {
    const color = colors.find((color) => color.internalName === colorInternalName)
    return color ?? defaultColor
}
