import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_REQUEST_ID, DEFAULT_TASK } from './testUtils/testDefaults'
import { getSyncBaseUri, ENDPOINT_SYNC } from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'
import { getTaskUrl } from './utils/urlHelpers'

function getTarget(baseUrl = 'https://api.todoist.com') {
    return new TodoistApi(DEFAULT_AUTH_TOKEN, baseUrl)
}

describe('TodoistApi moveTasks', () => {
    const TASK_IDS = ['123', '456', '789']
    const MOVED_TASKS = TASK_IDS.map((id) => ({
        ...DEFAULT_TASK,
        id,
        projectId: '999',
        url: getTaskUrl(id, DEFAULT_TASK.content),
    }))

    test('moves multiple tasks to project with unique UUIDs', async () => {
        const requestMock = setupRestClientMock({
            items: MOVED_TASKS,
            sync_status: { [expect.any(String)]: 'ok' },
        })
        const api = getTarget()

        const result = await api.moveTasks(TASK_IDS, { projectId: '999' }, DEFAULT_REQUEST_ID)

        // Verify API call structure
        expect(requestMock).toHaveBeenCalledWith({
            httpMethod: 'POST',
            baseUri: getSyncBaseUri(),
            relativePath: ENDPOINT_SYNC,
            apiToken: DEFAULT_AUTH_TOKEN,
            payload: expect.objectContaining({
                commands: expect.arrayContaining([
                    expect.objectContaining({
                        type: 'item_move',
                        args: expect.objectContaining({ project_id: '999' }),
                    }),
                ]),
                resource_types: ['items'],
            }),
            requestId: DEFAULT_REQUEST_ID,
            hasSyncCommands: true,
        })

        // Verify return value
        expect(result).toEqual(MOVED_TASKS)

        // Critical: Verify unique UUIDs (see https://github.com/Doist/todoist-api-typescript/issues/310)
        const sentRequest = (
            requestMock.mock.calls[0][0] as { payload: { commands: Array<{ uuid: string }> } }
        ).payload
        const uuids = sentRequest.commands.map((cmd) => cmd.uuid)
        const uniqueUuids = new Set(uuids)
        expect(uniqueUuids.size).toBe(TASK_IDS.length) // All UUIDs must be different
    })

    test('supports section move', async () => {
        const requestMock = setupRestClientMock({
            items: [{ ...DEFAULT_TASK, id: '123', sectionId: '888' }],
            sync_status: { [expect.any(String)]: 'ok' },
        })
        const api = getTarget()

        await api.moveTasks(['123'], { sectionId: '888' })

        const sentRequest = (
            requestMock.mock.calls[0][0] as {
                payload: { commands: Array<{ args: Record<string, unknown> }> }
            }
        ).payload
        expect(sentRequest.commands[0].args).toEqual({
            id: '123',
            section_id: '888',
        })
    })

    test('supports parent move', async () => {
        const requestMock = setupRestClientMock({
            items: [{ ...DEFAULT_TASK, id: '123', parentId: '777' }],
            sync_status: { [expect.any(String)]: 'ok' },
        })
        const api = getTarget()

        await api.moveTasks(['123'], { parentId: '777' })

        const sentRequest = (
            requestMock.mock.calls[0][0] as {
                payload: { commands: Array<{ args: Record<string, unknown> }> }
            }
        ).payload
        expect(sentRequest.commands[0].args).toEqual({
            id: '123',
            parent_id: '777',
        })
    })

    test('handles error cases', async () => {
        const api = getTarget()

        // Test maximum limit
        const manyTaskIds = Array.from({ length: 101 }, (_, i) => `task_${i}`)
        await expect(api.moveTasks(manyTaskIds, { projectId: '999' })).rejects.toThrow(
            'Maximum number of items is 100',
        )

        // Test sync API error
        setupRestClientMock({
            items: [],
            sync_status: { uuid: { error: 'TASK_NOT_FOUND', http_code: 404, error_extra: {} } },
        })
        await expect(api.moveTasks(['123'], { projectId: '999' })).rejects.toThrow('TASK_NOT_FOUND')

        // Test no tasks returned
        setupRestClientMock({ sync_status: { [expect.any(String)]: 'ok' } })
        await expect(api.moveTasks(['123'], { projectId: '999' })).rejects.toThrow(
            'Tasks not found',
        )
    })

    test('filters returned tasks to requested IDs only', async () => {
        const extraTask = {
            ...DEFAULT_TASK,
            id: '999',
            projectId: '999',
            url: getTaskUrl('999', DEFAULT_TASK.content),
        }
        setupRestClientMock({
            items: [...MOVED_TASKS, extraTask],
            sync_status: { [expect.any(String)]: 'ok' },
        })
        const api = getTarget()

        const result = await api.moveTasks(TASK_IDS, { projectId: '999' })

        expect(result).toEqual(MOVED_TASKS) // Should not include extraTask
        expect(result).not.toContainEqual(extraTask)
    })
})
