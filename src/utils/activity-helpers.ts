/**
 * Converts modern SDK object type naming to legacy API naming.
 * Maps 'task' -> 'item' and 'comment' -> 'note' for API requests.
 * Other values pass through unchanged.
 *
 * @internal
 * @param objectType The object type using modern naming.
 * @returns The object type using legacy API naming.
 */
export function normalizeObjectTypeForApi(objectType: string | undefined): string | undefined {
    if (!objectType) return objectType
    if (objectType === 'task') return 'item'
    if (objectType === 'comment') return 'note'
    return objectType
}

/**
 * Converts legacy API object type naming to modern SDK naming.
 * Maps 'item' -> 'task' and 'note' -> 'comment' for SDK responses.
 * Other values pass through unchanged.
 *
 * @internal
 * @param objectType The object type using legacy API naming.
 * @returns The object type using modern SDK naming.
 */
export function denormalizeObjectTypeFromApi(objectType: string | undefined): string | undefined {
    if (!objectType) return objectType
    if (objectType === 'item') return 'task'
    if (objectType === 'note') return 'comment'
    return objectType
}
