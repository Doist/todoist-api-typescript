/**
 * Joins path segments using `/` separator.
 * @param segments A list of **valid** path segments.
 * @returns A joined path.
 */
export function generatePath(...segments: string[]): string {
    return segments.join('/')
}

/**
 * Returns `fn(value)` spread into an object if `value` is defined, otherwise an empty object.
 *
 * Used to conditionally include a property on a payload object without
 * resorting to mutation or ternary-built object literals.
 */
export function spreadIfDefined<T, V extends Record<string, unknown>>(
    value: T | undefined,
    fn: (v: T) => V,
): V | Record<string, never> {
    return value !== undefined ? fn(value) : {}
}
