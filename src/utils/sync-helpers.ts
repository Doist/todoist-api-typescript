import { v4 as uuidv4 } from 'uuid'
import type { SyncCommandType, SyncCommandsMap, SyncCommand } from '../types/sync/commands'

/**
 * Creates a strongly-typed Sync API command with an auto-generated UUID.
 *
 * @param type - The command type (e.g. `'item_add'`, `'project_update'`).
 * @param args - The command arguments, constrained by the command type.
 * @param tempId - Optional temporary ID for referencing the created resource in subsequent commands.
 * @returns A fully formed `SyncCommand` ready to include in a sync request.
 *
 * @example
 * ```typescript
 * const cmd = createCommand('item_add', { content: 'Buy milk', priority: 2 })
 * // cmd.type === 'item_add'
 * // cmd.args is typed as TaskAddArgs
 * ```
 */
export function createCommand<T extends SyncCommandType>(
    type: T,
    args: SyncCommandsMap[T],
    tempId?: string,
): SyncCommand<T> {
    return {
        type,
        uuid: uuidv4(),
        args: args as SyncCommand<T>['args'],
        ...(tempId !== undefined ? { tempId } : {}),
    }
}
