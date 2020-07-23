export const truncate = (input: string, maxLength: number): string => {
    const ellipsis = '...'
    const isOverMaxLength = input.length > maxLength

    if (!isOverMaxLength) return input

    return input.substr(0, maxLength - ellipsis.length) + ellipsis
}

export const formatString = (
    templatedString: string,
    ...args: (number | string | boolean | undefined | null)[]
): string => {
    for (let i = 0; i < args.length; i++) {
        const templateMatch = new RegExp('\\{' + i + '\\}', 'gi')
        const replacementValue = args[i]

        templatedString = templatedString.replace(
            templateMatch,
            replacementValue ? replacementValue.toString() : '',
        )
    }

    return templatedString
}
