import camelcase from 'camelcase'
import emojiRegex from 'emoji-regex'

/**
 * Checks if a string is a solitary emoji
 */
function isEmojiKey(input: string): boolean {
    const regex = emojiRegex()
    const match = input.match(regex)
    return match !== null && match.join('') === input
}

/**
 * Custom camelCase function that preserves emoji strings
 */
export function customCamelCase(input: string): string {
    // If the value is a solitary emoji string, return the key as-is
    if (isEmojiKey(input)) {
        return input
    }
    return camelcase(input)
}

/**
 * Converts object keys from snake_case to camelCase recursively
 */
export function camelCaseKeys<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map((item: unknown) => camelCaseKeys(item)) as T
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        const converted: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj)) {
            const camelKey = customCamelCase(key)
            converted[camelKey] = camelCaseKeys(value)
        }
        return converted as T
    }

    return obj
}

/**
 * Converts object keys from camelCase to snake_case recursively
 */
export function snakeCaseKeys<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map((item: unknown) => snakeCaseKeys(item)) as T
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        const converted: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj)) {
            // Convert camelCase to snake_case
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
            converted[snakeKey] = snakeCaseKeys(value)
        }
        return converted as T
    }

    return obj
}
