const defaultColor = '#808080'

const entityIdToColorMappings: { [colorId: number]: string } = {
    30: '#b8256f',
    31: '#db4035',
    32: '#ff9933',
    33: '#fad000',
    34: '#afb83b',
    35: '#7ecc49',
    36: '#299438',
    37: '#6accbc',
    38: '#158fad',
    39: '#14aaf5',
    40: '#96c3eb',
    41: '#4073ff',
    42: '#884dff',
    43: '#af38eb',
    44: '#eb96eb',
    45: '#e05194',
    46: '#ff8d85',
    47: '#808080',
    48: '#b8b8b8',
    49: '#ccac93',
}

export const getEntityColor = (colorId: number): string => {
    const color = entityIdToColorMappings[colorId]
    return color ?? defaultColor
}
