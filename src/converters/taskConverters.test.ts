import { getTaskFromQuickAddResponse } from './taskConverters'
import { DEFAULT_QUICK_ADD_RESPONSE, DEFAULT_TASK } from '../testData/testDefaults'
import theoretically from 'jest-theories'

describe('getTaskFromQuickAddResponse', () => {
    test('maps sync data to expected task properties', async () => {
        const task = getTaskFromQuickAddResponse(DEFAULT_QUICK_ADD_RESPONSE)
        expect(task).toEqual(DEFAULT_TASK)
    })

    test('converts null sectionId to 0', async () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            sectionId: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.sectionId).toEqual(0)
    })

    test('converts null parentId to undefined', async () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            parentId: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.parentId).toEqual(undefined)
    })

    test('converts null assignee to undefined', async () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            responsibleUid: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.assignee).toEqual(undefined)
    })

    const completedTheories = [
        { checked: 0, completed: false },
        { checked: 1, completed: true },
    ]

    theoretically(
        'checked number value: {checked} converted to completed boolean value: {completed}',
        completedTheories,
        async (theory) => {
            const quickAddResponse = {
                ...DEFAULT_QUICK_ADD_RESPONSE,
                checked: theory.checked,
            }
            const task = getTaskFromQuickAddResponse(quickAddResponse)
            expect(task.completed).toEqual(theory.completed)
        },
    )

    test('converts null due date to undefined', async () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            due: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.due).toEqual(undefined)
    })

    const taskUrlTheories = [
        { id: 1234, syncId: null, url: 'https://todoist.com/showTask?id=1234' },
        { id: 1234, syncId: 0, url: 'https://todoist.com/showTask?id=1234' },
        { id: 1234, syncId: 5678, url: 'https://todoist.com/showTask?id=1234&sync_id=5678' },
    ]

    theoretically(
        'returns expected url: {url} for id: {id} and syncId: {syncId}',
        taskUrlTheories,
        async (theory) => {
            const quickAddResponse = {
                ...DEFAULT_QUICK_ADD_RESPONSE,
                id: theory.id,
                syncId: theory.syncId,
            }
            const task = getTaskFromQuickAddResponse(quickAddResponse)
            expect(task.url).toEqual(theory.url)
        },
    )
})
