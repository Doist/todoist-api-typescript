import { TodoistApi } from '.'
import {
    DEFAULT_AUTH_TOKEN,
    DEFAULT_REQUEST_ID,
    DEFAULT_TASK,
    TASK_WITH_OPTIONALS_AS_NULL,
    DEFAULT_TASK_ID,
} from './test-utils/test-defaults'
import {
    getSyncBaseUri,
    ENDPOINT_REST_TASK_CLOSE,
    ENDPOINT_REST_TASK_REOPEN,
    ENDPOINT_REST_TASKS,
    ENDPOINT_REST_TASKS_FILTER,
    ENDPOINT_REST_TASKS_COMPLETED_BY_COMPLETION_DATE,
    ENDPOINT_REST_TASKS_COMPLETED_BY_DUE_DATE,
    ENDPOINT_REST_TASKS_COMPLETED_SEARCH,
    ENDPOINT_SYNC_QUICK_ADD,
} from './consts/endpoints'
import { setupRestClientMock } from './test-utils/mocks'
import { getTaskUrl } from './utils/url-helpers'

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

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_TASKS,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_ADD_TASK_ARGS,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('calls post on restClient with expected parameters against staging', async () => {
            const requestMock = setupRestClientMock(DEFAULT_TASK)
            const api = getTarget('https://staging.todoist.com')

            await api.addTask(DEFAULT_ADD_TASK_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri('https://staging.todoist.com'),
                relativePath: ENDPOINT_REST_TASKS,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_ADD_TASK_ARGS,
                requestId: DEFAULT_REQUEST_ID,
            })
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
        const DEFAULT_UPDATED_TASK_URL = getTaskUrl(
            DEFAULT_TASK_ID,
            DEFAULT_UPDATE_TASK_ARGS.content,
        )

        test('calls post on restClient with expected parameters', async () => {
            const taskId = '123'
            const requestMock = setupRestClientMock(DEFAULT_TASK, 204)
            const api = getTarget()

            await api.updateTask(taskId, DEFAULT_UPDATE_TASK_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_TASKS}/${taskId}`,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_UPDATE_TASK_ARGS,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns success result from rest client', async () => {
            const returnedTask = {
                ...DEFAULT_TASK,
                ...DEFAULT_UPDATE_TASK_ARGS,
                url: DEFAULT_UPDATED_TASK_URL,
            }
            setupRestClientMock(returnedTask, 204)
            const api = getTarget()

            const response = await api.updateTask('123', DEFAULT_UPDATE_TASK_ARGS)

            expect(response).toEqual(returnedTask)
        })
    })

    describe('closeTask', () => {
        test('calls post on close endpoint', async () => {
            const taskId = '123'
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.closeTask(taskId, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_TASKS}/${taskId}/${ENDPOINT_REST_TASK_CLOSE}`,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: undefined,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const response = await api.closeTask('123')

            expect(response).toEqual(true)
        })
    })

    describe('reopenTask', () => {
        test('calls post on reopen endpoint', async () => {
            const taskId = '123'
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.reopenTask(taskId, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_TASKS}/${taskId}/${ENDPOINT_REST_TASK_REOPEN}`,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: undefined,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const response = await api.reopenTask('123')

            expect(response).toEqual(true)
        })
    })

    describe('deleteTask', () => {
        test('calls delete on expected task', async () => {
            const taskId = '123'
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.deleteTask(taskId, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'DELETE',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_TASKS}/${taskId}`,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: undefined,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const response = await api.deleteTask('123')

            expect(response).toEqual(true)
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
            const requestMock = setupRestClientMock(DEFAULT_TASK)
            const api = getTarget()

            await api.quickAddTask(DEFAULT_QUICK_ADD_ARGS)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_SYNC_QUICK_ADD,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_QUICK_ADD_ARGS,
            })
        })

        test('calls task converter with response data and returns result', async () => {
            setupRestClientMock(DEFAULT_TASK)
            const api = getTarget()
            const task = await api.quickAddTask(DEFAULT_QUICK_ADD_ARGS)
            expect(task).toEqual(DEFAULT_TASK)
        })
    })

    describe('getTask', () => {
        test('calls get request with expected url', async () => {
            const taskId = '12'
            const requestMock = setupRestClientMock(DEFAULT_TASK)
            const api = getTarget()

            await api.getTask(taskId)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_TASKS}/${taskId}`,
                apiToken: DEFAULT_AUTH_TOKEN,
            })
        })
    })

    describe('getTasks', () => {
        const DEFAULT_GET_TASKS_ARGS = {
            projectId: '123',
            limit: 10,
            cursor: '0',
        }

        test('calls get on expected endpoint with args', async () => {
            const requestMock = setupRestClientMock({
                results: [DEFAULT_TASK, TASK_WITH_OPTIONALS_AS_NULL],
                nextCursor: '123',
            })
            const api = getTarget()

            await api.getTasks(DEFAULT_GET_TASKS_ARGS)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_TASKS,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_GET_TASKS_ARGS,
            })
        })

        test('returns result from rest client', async () => {
            const tasks = [DEFAULT_TASK]
            setupRestClientMock({ results: tasks, nextCursor: '123' })
            const api = getTarget()

            const { results, nextCursor } = await api.getTasks(DEFAULT_GET_TASKS_ARGS)

            expect(results).toEqual(tasks)
            expect(nextCursor).toBe('123')
        })
    })

    describe('getTasksByFilter', () => {
        const DEFAULT_GET_TASKS_BY_FILTER_ARGS = {
            query: 'today',
            lang: 'en',
            cursor: null,
            limit: 10,
        }

        test('calls get request with expected url', async () => {
            const requestMock = setupRestClientMock({ results: [DEFAULT_TASK], nextCursor: null })
            const api = getTarget()

            await api.getTasksByFilter(DEFAULT_GET_TASKS_BY_FILTER_ARGS)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_TASKS_FILTER,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_GET_TASKS_BY_FILTER_ARGS,
            })
        })

        test('returns result from rest client', async () => {
            setupRestClientMock({ results: [DEFAULT_TASK], nextCursor: null })
            const api = getTarget()

            const response = await api.getTasksByFilter(DEFAULT_GET_TASKS_BY_FILTER_ARGS)

            expect(response).toEqual({
                results: [DEFAULT_TASK],
                nextCursor: null,
            })
        })

        test('validates task array in response', async () => {
            const invalidTask = { ...DEFAULT_TASK, due: '2020-01-31' }
            setupRestClientMock({ results: [invalidTask], nextCursor: null })
            const api = getTarget()

            await expect(api.getTasksByFilter(DEFAULT_GET_TASKS_BY_FILTER_ARGS)).rejects.toThrow()
        })
    })

    describe('getCompletedTasksByCompletionDate', () => {
        const DEFAULT_GET_COMPLETED_TASKS_ARGS = {
            since: '2025-01-01T00:00:00Z',
            until: '2025-12-31T23:59:59Z',
            workspaceId: null,
            cursor: null,
            limit: 10,
        }

        test('calls get request with expected url', async () => {
            const requestMock = setupRestClientMock({ items: [DEFAULT_TASK], nextCursor: null })
            const api = getTarget()

            await api.getCompletedTasksByCompletionDate(DEFAULT_GET_COMPLETED_TASKS_ARGS)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_TASKS_COMPLETED_BY_COMPLETION_DATE,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_GET_COMPLETED_TASKS_ARGS,
            })
        })

        test('returns result from rest client', async () => {
            setupRestClientMock({ items: [DEFAULT_TASK], nextCursor: '123' })
            const api = getTarget()

            const response = await api.getCompletedTasksByCompletionDate(
                DEFAULT_GET_COMPLETED_TASKS_ARGS,
            )

            expect(response).toEqual({
                items: [DEFAULT_TASK],
                nextCursor: '123',
            })
        })

        test('validates task array in response', async () => {
            const invalidTask = { ...DEFAULT_TASK, due: '2020-01-31' }
            setupRestClientMock({ items: [invalidTask], nextCursor: null })
            const api = getTarget()

            await expect(
                api.getCompletedTasksByCompletionDate(DEFAULT_GET_COMPLETED_TASKS_ARGS),
            ).rejects.toThrow()
        })
    })

    describe('getCompletedTasksByDueDate', () => {
        const DEFAULT_GET_COMPLETED_TASKS_ARGS = {
            since: '2025-01-01T00:00:00Z',
            until: '2025-12-31T23:59:59Z',
            workspaceId: null,
            cursor: null,
            limit: 10,
        }

        test('calls get request with expected url', async () => {
            const requestMock = setupRestClientMock({ items: [DEFAULT_TASK], nextCursor: null })
            const api = getTarget()

            await api.getCompletedTasksByDueDate(DEFAULT_GET_COMPLETED_TASKS_ARGS)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_TASKS_COMPLETED_BY_DUE_DATE,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_GET_COMPLETED_TASKS_ARGS,
            })
        })

        test('returns result from rest client', async () => {
            setupRestClientMock({ items: [DEFAULT_TASK], nextCursor: '456' })
            const api = getTarget()

            const response = await api.getCompletedTasksByDueDate(DEFAULT_GET_COMPLETED_TASKS_ARGS)

            expect(response).toEqual({
                items: [DEFAULT_TASK],
                nextCursor: '456',
            })
        })

        test('validates task array in response', async () => {
            const invalidTask = { ...DEFAULT_TASK, due: '2020-01-31' }
            setupRestClientMock({ items: [invalidTask], nextCursor: null })
            const api = getTarget()

            await expect(
                api.getCompletedTasksByDueDate(DEFAULT_GET_COMPLETED_TASKS_ARGS),
            ).rejects.toThrow()
        })
    })

    describe('searchCompletedTasks', () => {
        const DEFAULT_SEARCH_COMPLETED_TASKS_ARGS = {
            query: 'buy milk',
            cursor: null,
            limit: 10,
        }

        test('calls get request with expected url', async () => {
            const requestMock = setupRestClientMock({ items: [DEFAULT_TASK], nextCursor: null })
            const api = getTarget()

            await api.searchCompletedTasks(DEFAULT_SEARCH_COMPLETED_TASKS_ARGS)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_TASKS_COMPLETED_SEARCH,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: DEFAULT_SEARCH_COMPLETED_TASKS_ARGS,
            })
        })

        test('returns result from rest client', async () => {
            setupRestClientMock({ items: [DEFAULT_TASK], nextCursor: '789' })
            const api = getTarget()

            const response = await api.searchCompletedTasks(DEFAULT_SEARCH_COMPLETED_TASKS_ARGS)

            expect(response).toEqual({
                items: [DEFAULT_TASK],
                nextCursor: '789',
            })
        })

        test('validates task array in response', async () => {
            const invalidTask = { ...DEFAULT_TASK, due: '2020-01-31' }
            setupRestClientMock({ items: [invalidTask], nextCursor: null })
            const api = getTarget()

            await expect(
                api.searchCompletedTasks(DEFAULT_SEARCH_COMPLETED_TASKS_ARGS),
            ).rejects.toThrow()
        })
    })
})
