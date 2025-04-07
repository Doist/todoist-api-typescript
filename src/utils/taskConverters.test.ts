import { getTaskFromQuickAddResponse } from './taskConverters'
import { DEFAULT_QUICK_ADD_RESPONSE, DEFAULT_TASK } from '../testUtils/testDefaults'

describe('getTaskFromQuickAddResponse', () => {
    test('maps sync data to expected task properties', () => {
        const task = getTaskFromQuickAddResponse(DEFAULT_QUICK_ADD_RESPONSE)
        expect(task).toEqual({ ...DEFAULT_TASK, labels: ['personal', 'work', 'hobby'] })
    })

    const completedTheories = [
        [false, false],
        [true, true],
    ] as const

    test.each(completedTheories)(
        'checked number value: %p converted to completed boolean value: %p',
        (checked, completedBoolean) => {
            const quickAddResponse = {
                ...DEFAULT_QUICK_ADD_RESPONSE,
                checked,
            }

            const task = getTaskFromQuickAddResponse(quickAddResponse)
            expect(task.isCompleted).toEqual(completedBoolean)
        },
    )

    const taskUrlTheories = [
        ['1234', 'https://todoist.com/showTask?id=1234'],
        ['1234', 'https://todoist.com/showTask?id=1234'],
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
