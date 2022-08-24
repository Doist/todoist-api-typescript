import { getTaskFromQuickAddResponse } from './taskConverters'
import { DEFAULT_QUICK_ADD_RESPONSE, DEFAULT_TASK } from '../testUtils/testDefaults'

describe('getTaskFromQuickAddResponse', () => {
    test('maps sync data to expected task properties', () => {
        const task = getTaskFromQuickAddResponse(DEFAULT_QUICK_ADD_RESPONSE)
        expect(task).toEqual({ ...DEFAULT_TASK, labels: ['1', '2', '3'] })
    })

    test('converts null sectionId to null', () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            sectionId: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.sectionId).toEqual(undefined)
    })

    test('converts null parentId to undefined', () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            parentId: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.parentId).toEqual(undefined)
    })

    test('converts null assigneeId to undefined', () => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            responsibleUid: null,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.assigneeId).toEqual(undefined)
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
            expect(task.isCompleted).toEqual(completedBoolean)
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
        [1234, 'https://todoist.com/showTask?id=1234'],
        [1234, 'https://todoist.com/showTask?id=1234'],
    ] as const

    test.each(taskUrlTheories)('with id %p and syncId %p returns url %p', (id, url) => {
        const quickAddResponse = {
            ...DEFAULT_QUICK_ADD_RESPONSE,
            id,
        }
        const task = getTaskFromQuickAddResponse(quickAddResponse)
        expect(task.url).toEqual(url)
    })
})
