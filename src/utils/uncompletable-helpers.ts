const UNCOMPLETABLE_PREFIX = '* '

/**
 * Adds the uncompletable prefix (* ) to task content if not already present
 * @param content - The task content
 * @returns Content with uncompletable prefix added
 */
export function addUncompletablePrefix(content: string): string {
    if (content.startsWith(UNCOMPLETABLE_PREFIX)) {
        return content
    }
    return UNCOMPLETABLE_PREFIX + content
}

/**
 * Removes the uncompletable prefix (* ) from task content if present
 * @param content - The task content
 * @returns Content with uncompletable prefix removed
 */
export function removeUncompletablePrefix(content: string): string {
    if (content.startsWith(UNCOMPLETABLE_PREFIX)) {
        return content.slice(UNCOMPLETABLE_PREFIX.length)
    }
    return content
}

/**
 * Checks if task content has the uncompletable prefix (* )
 * @param content - The task content
 * @returns True if content starts with uncompletable prefix
 */
export function hasUncompletablePrefix(content: string): boolean {
    return content.startsWith(UNCOMPLETABLE_PREFIX)
}

/**
 * Processes task content based on isUncompletable flag, with content prefix taking precedence
 * @param content - The original task content
 * @param isUncompletable - Optional flag to make task uncompletable
 * @returns Processed content
 *
 * Logic:
 * - If content already has * prefix, task is uncompletable regardless of flag
 * - If content doesn't have * prefix and isUncompletable is true, add the prefix
 * - If isUncompletable is undefined or false (and no prefix), leave content unchanged
 */
export function processTaskContent(content: string, isUncompletable?: boolean): string {
    // Content prefix takes precedence - if already has prefix, keep it
    if (hasUncompletablePrefix(content)) {
        return content
    }

    // If content doesn't have prefix and user wants uncompletable, add it
    if (isUncompletable === true) {
        return addUncompletablePrefix(content)
    }

    // Otherwise, leave content unchanged
    return content
}
