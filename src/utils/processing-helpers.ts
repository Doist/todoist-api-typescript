import camelcase from 'camelcase'
import emojiRegex from 'emoji-regex'

function isEmojiKey(key: string) {
    const regex = emojiRegex()
    return regex.test(key)
}

export function customCamelCase(input: string) {
    // If the value is a solitary emoji string, return the key as-is
    if (isEmojiKey(input)) return input
    return camelcase(input)
}
