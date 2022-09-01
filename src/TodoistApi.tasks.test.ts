import * as taskConverters from './utils/taskConverters'
import { TodoistApi } from '.'
import { Task } from './types'
import {
    DEFAULT_AUTH_TOKEN,
    DEFAULT_QUICK_ADD_RESPONSE,
    DEFAULT_REQUEST_ID,
    DEFAULT_TASK,
    INVALID_ENTITY_ID,
} from './testUtils/testDefaults'
import {
    getRestBaseUri,
    getSyncBaseUri,
    ENDPOINT_REST_TASK_CLOSE,
    ENDPOINT_REST_TASK_REOPEN,
    ENDPOINT_REST_TASKS,
    ENDPOINT_SYNC_QUICK_ADD,
} from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'
import { assertInputValidationError } from './testUtils/asserts'

function setupSyncTaskConverter(returnedTask: Task) {
    return jest.spyOn(taskConverters, 'getTaskFromQuickAddResponse').mockReturnValue(returnedTask)
}

function getTarget(baseUrl = 'https://api.todoist.com') {
    return new TodoistApi(DEFAULT_AUTH_TOKEN, baseUrl)
}

describe('TodoistApi task endpoints', () => {
    describe('addTask', () => {
        const DEFAULT_ADD_TASK_ARGS = {
            content: 'This is a task',
        }

        test('calls post on restClient with expected parameters', async () => {
            const requestMock = setupRestClientMock(DEFAULT_TASK)
            const api = getTarget()

            await api.addTask(DEFAULT_ADD_TASK_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getRestBaseUri(),
                ENDPOINT_REST_TASKS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_ADD_TASK_ARGS,
                DEFAULT_REQUEST_ID,
            )
        })

        test('calls post on restClient with expected parameters against staging', async () => {
            const requestMock = setupRestClientMock(DEFAULT_TASK)
            const api = getTarget('https://staging.todoist.com')

            await api.addTask(DEFAULT_ADD_TASK_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getRestBaseUri('https://staging.todoist.com'),
                ENDPOINT_REST_TASKS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_ADD_TASK_ARGS,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_TASK)
            const api = getTarget()

            const task = await api.addTask(DEFAULT_ADD_TASK_ARGS)

            expect(task).toEqual(DEFAULT_TASK)
        })
    })

    describe('updateTask', () => {
        const DEFAULT_UPDATE_TASK_ARGS = { content: 'some new content' }

        test('calls post on restClient with expected parameters', async () => {
            const taskId = 123
            const requestMock = setupRestClientMock(DEFAULT_TASK, 204)
            const api = getTarget()

            await api.updateTask(taskId, DEFAULT_UPDATE_TASK_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getRestBaseUri(),
                `${ENDPOINT_REST_TASKS}/${taskId}`,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_UPDATE_TASK_ARGS,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            const returnedTask = { ...DEFAULT_TASK, ...DEFAULT_UPDATE_TASK_ARGS }
            setupRestClientMock(returnedTask, 204)
            const api = getTarget()

            const response = await api.updateTask(123, DEFAULT_UPDATE_TASK_ARGS)

            expect(response).toEqual(returnedTask)
        })

        test('throws validation error for invalid id input', async () => {
            await assertInputValidationError(
                async () =>
                    await getTarget().updateTask(INVALID_ENTITY_ID, { content: 'some content' }),
            )
        })
    })

    describe('closeTask', () => {
        test('calls post on close endpoint', async () => {
            const taskId = 123
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.closeTask(taskId, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getRestBaseUri(),
                `${ENDPOINT_REST_TASKS}/${taskId}/${ENDPOINT_REST_TASK_CLOSE}`,
                DEFAULT_AUTH_TOKEN,
                undefined,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const response = await api.closeTask(123)

            expect(response).toEqual(true)
        })

        test('throws validation error for invalid id input', async () => {
            await assertInputValidationError(
                async () => await getTarget().closeTask(INVALID_ENTITY_ID),
            )
        })
    })

    describe('reopenTask', () => {
        test('calls post on reopen endpoint', async () => {
            const taskId = 123
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.reopenTask(taskId, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getRestBaseUri(),
                `${ENDPOINT_REST_TASKS}/${taskId}/${ENDPOINT_REST_TASK_REOPEN}`,
                DEFAULT_AUTH_TOKEN,
                undefined,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const response = await api.reopenTask(123)

            expect(response).toEqual(true)
        })

        test('throws validation error for invalid id input', async () => {
            await assertInputValidationError(
                async () => await getTarget().reopenTask(INVALID_ENTITY_ID),
            )
        })
    })

    describe('deleteTask', () => {
        test('calls delete on expected task', async () => {
            const taskId = 123
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.deleteTask(taskId, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'DELETE',
                getRestBaseUri(),
                `${ENDPOINT_REST_TASKS}/${taskId}`,
                DEFAULT_AUTH_TOKEN,
                undefined,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const response = await api.deleteTask(123)

            expect(response).toEqual(true)
        })

        test('throws validation error for invalid id input', async () => {
            await assertInputValidationError(
                async () => await getTarget().deleteTask(INVALID_ENTITY_ID),
            )
        })
    })

    describe('quickAddTask', () => {
        const DEFAULT_QUICK_ADD_ARGS = {
            text: 'This is a quick add text',
            note: 'This is a note',
            reminder: 'tomorrow 5pm',
            autoReminder: true,
        }

        test('calls sync endpoint with expected parameters', async () => {
            const requestMock = setupRestClientMock(DEFAULT_QUICK_ADD_RESPONSE)
            const api = getTarget()

            await api.quickAddTask(DEFAULT_QUICK_ADD_ARGS)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getSyncBaseUri(),
                ENDPOINT_SYNC_QUICK_ADD,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_QUICK_ADD_ARGS,
            )
        })

        test('calls task converter with response data and returns result', async () => {
            setupRestClientMock(DEFAULT_QUICK_ADD_RESPONSE)
            const taskConverter = setupSyncTaskConverter(DEFAULT_TASK)
            const api = getTarget()

            const task = await api.quickAddTask(DEFAULT_QUICK_ADD_ARGS)

            expect(taskConverter).toBeCalledTimes(1)
            expect(taskConverter).toBeCalledWith(DEFAULT_QUICK_ADD_RESPONSE)
            expect(task).toEqual(DEFAULT_TASK)
        })
    })

    describe('getTask', () => {
        test('calls get request with expected url', async () => {
            const taskId = 12
            const requestMock = setupRestClientMock(DEFAULT_TASK)
            const api = getTarget()

            await api.getTask(taskId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                getRestBaseUri(),
                `${ENDPOINT_REST_TASKS}/${taskId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('throws validation error for invalid id input', async () => {
            await assertInputValidationError(
                async () => await getTarget().getTask(INVALID_ENTITY_ID),
            )
        })
    })

    describe('getTasks', () => {
        const DEFAULT_GET_TASKS_ARGS = {
            projectId: '123',
        }

        test('calls get on expected endpoint with args', async () => {
            const requestMock = setupRestClientMock([DEFAULT_TASK])
            const api = getTarget()

            await api.getTasks(DEFAULT_GET_TASKS_ARGS)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                getRestBaseUri(),
                ENDPOINT_REST_TASKS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_GET_TASKS_ARGS,
            )
        })

        test('returns result from rest client', async () => {
            const tasks = [DEFAULT_TASK]
            setupRestClientMock(tasks)
            const api = getTarget()

            const response = await api.getTasks(DEFAULT_GET_TASKS_ARGS)

            expect(response).toEqual(tasks)
        })
    })
})
