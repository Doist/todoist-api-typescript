import * as taskConverters from './utils/taskConverters'
import { TodoistApi } from '.'
import { Task } from './types'
import {
    DEFAULT_AUTH_TOKEN,
    DEFAULT_QUICK_ADD_RESPONSE,
    DEFAULT_TASK,
} from './testUtils/testDefaults'
import {
    API_REST_BASE_URI,
    API_SYNC_BASE_URI,
    ENDPOINT_REST_TASK_CLOSE,
    ENDPOINT_REST_TASK_REOPEN,
    ENDPOINT_REST_TASKS,
    ENDPOINT_SYNC_QUICK_ADD,
} from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'

const setupSyncTaskConverter = (returnedTask: Task) => {
    return jest.spyOn(taskConverters, 'getTaskFromQuickAddResponse').mockReturnValue(returnedTask)
}

const getTarget = () => new TodoistApi(DEFAULT_AUTH_TOKEN)

describe('TodoistApi task endpoints', () => {
    describe('addTask', () => {
        const DEFAULT_ADD_TASK_ARGS = {
            content: 'This is a task',
        }

        test('calls post on restClient with expected parameters', async () => {
            const requestMock = setupRestClientMock(DEFAULT_TASK)
            const api = getTarget()

            await api.addTask(DEFAULT_ADD_TASK_ARGS)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_REST_BASE_URI,
                ENDPOINT_REST_TASKS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_ADD_TASK_ARGS,
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
        test('calls post on restClient with expected parameters', async () => {
            const taskId = 123
            const updateArgs = { content: 'some new content' }
            const requestMock = setupRestClientMock(true)
            const api = getTarget()

            await api.updateTask(taskId, updateArgs)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_TASKS}/${taskId}`,
                DEFAULT_AUTH_TOKEN,
                updateArgs,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(true)
            const api = getTarget()

            const response = await api.updateTask(123, { content: 'some content' })

            expect(response).toEqual(true)
        })
    })

    describe('closeTask', () => {
        test('calls post on close endpoint', async () => {
            const taskId = 123
            const requestMock = setupRestClientMock(true)
            const api = getTarget()

            await api.closeTask(taskId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_TASKS}/${taskId}/${ENDPOINT_REST_TASK_CLOSE}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(true)
            const api = getTarget()

            const response = await api.closeTask(123)

            expect(response).toEqual(true)
        })
    })

    describe('reopenTask', () => {
        test('calls post on reopen endpoint', async () => {
            const taskId = 123
            const requestMock = setupRestClientMock(true)
            const api = getTarget()

            await api.reopenTask(taskId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_TASKS}/${taskId}/${ENDPOINT_REST_TASK_REOPEN}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(true)
            const api = getTarget()

            const response = await api.reopenTask(123)

            expect(response).toEqual(true)
        })
    })

    describe('deleteTask', () => {
        test('calls delete on expected task', async () => {
            const taskId = 123
            const requestMock = setupRestClientMock(true)
            const api = getTarget()

            await api.deleteTask(taskId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'DELETE',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_TASKS}/${taskId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(true)
            const api = getTarget()

            const response = await api.deleteTask(123)

            expect(response).toEqual(true)
        })
    })

    describe('quickAddTask', () => {
        const DEFAULT_QUICK_ADD_TEXT = 'This is a quick add text'

        test('calls sync endpoint with expected parameters', async () => {
            const requestMock = setupRestClientMock(DEFAULT_QUICK_ADD_RESPONSE)
            const api = getTarget()

            await api.quickAddTask(DEFAULT_QUICK_ADD_TEXT)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_SYNC_BASE_URI,
                ENDPOINT_SYNC_QUICK_ADD,
                DEFAULT_AUTH_TOKEN,
                { text: DEFAULT_QUICK_ADD_TEXT },
            )
        })

        test('calls task converter with response data and returns result', async () => {
            setupRestClientMock(DEFAULT_QUICK_ADD_RESPONSE)
            const taskConverter = setupSyncTaskConverter(DEFAULT_TASK)
            const api = getTarget()

            const task = await api.quickAddTask(DEFAULT_QUICK_ADD_TEXT)

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
                API_REST_BASE_URI,
                `${ENDPOINT_REST_TASKS}/${taskId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })
    })

    describe('getTasks', () => {
        const DEFAULT_GET_TASKS_ARGS = {
            projectId: 123,
        }

        test('calls get on expected endpoint with args', async () => {
            const requestMock = setupRestClientMock([DEFAULT_TASK])
            const api = getTarget()

            await api.getTasks(DEFAULT_GET_TASKS_ARGS)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                API_REST_BASE_URI,
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
