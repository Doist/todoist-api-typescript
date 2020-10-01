import { getTaskFromQuickAddResponse } from './taskConverters'
import { DEFAULT_QUICK_ADD_RESPONSE, DEFAULT_TASK } from '../testUtils/testDefaults'

describe('getTaskFromQuickAddResponse', () => {
    test('maps sync data to expected task properties', () => {
        const task = getTaskFromQuickAddResponse(DEFAULT_QUICK_ADD_RESPONSE)
        expect(task).toEqual(DEFAULT_TASK)
    })

    test('converts null sectionId to 0', () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            sectionId: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.sectionId).toEqual(0)
    })

    test('converts null parentId to undefined', () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            parentId: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.parentId).toEqual(undefined)
    })

    test('converts null assignee to undefined', () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            responsibleUid: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.assignee).toEqual(undefined)
    })

    const completedTheories = [
        [0, false],
        [1, true],
    ] as const

    test.each(completedTheories)(
        'checked number value: %p converted to completed boolean value: %p',
        (checkedInt, completedBoolean) => {
            const quickAddResponse = {
                ...DEFAULT_QUICK_ADD_RESPONSE,
                checked: checkedInt,
            }

            const task = getTaskFromQuickAddResponse(quickAddResponse)
            expect(task.completed).toEqual(completedBoolean)
        },
    )

    test('converts null due date to undefined', () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            due: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.due).toEqual(undefined)
    })

    const taskUrlTheories = [
        [1234, null, 'https://todoist.com/showTask?id=1234'],
        [1234, 0, 'https://todoist.com/showTask?id=1234'],
        [1234, 5678, 'https://todoist.com/showTask?id=1234&sync_id=5678'],
    ] as const

    test.each(taskUrlTheories)('with id %p and syncId %p returns url %p', (id, syncId, url) => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            id,
            syncId,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.url).toEqual(url)
    })
})
