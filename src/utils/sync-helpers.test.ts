import { createCommand } from './sync-helpers'

describe('createCommand', () => {
    test('sets the correct type', () => {
        const cmd = createCommand('item_add', { content: 'Buy milk' })
        expect(cmd.type).toBe('item_add')
    })

    test('auto-generates a UUID', () => {
        const cmd = createCommand('item_add', { content: 'Buy milk' })
        expect(cmd.uuid).toMatch(/^[0-9a-f-]{36}$/)
    })

    test('generates unique UUIDs per invocation', () => {
        const cmd1 = createCommand('item_add', { content: 'Buy milk' })
        const cmd2 = createCommand('item_add', { content: 'Buy milk' })
        expect(cmd1.uuid).not.toBe(cmd2.uuid)
    })

    test('passes args through correctly', () => {
        const args = { content: 'Buy milk', priority: 2 }
        const cmd = createCommand('item_add', args)
        expect(cmd.args).toEqual(args)
    })

    test('includes tempId when provided', () => {
        const cmd = createCommand('item_add', { content: 'Buy milk' }, 'temp-123')
        expect(cmd.tempId).toBe('temp-123')
    })

    test('omits tempId when not provided', () => {
        const cmd = createCommand('item_add', { content: 'Buy milk' })
        expect(cmd).not.toHaveProperty('tempId')
    })

    test('rejects invalid command name at compile time', () => {
        // @ts-expect-error 'task_add' is not a valid SyncCommandType
        createCommand('task_add', { content: 'Buy milk' })
    })

    test('rejects invalid args shape at compile time', () => {
        // @ts-expect-error 'content' is required for item_add
        createCommand('item_add', {})
    })
})
