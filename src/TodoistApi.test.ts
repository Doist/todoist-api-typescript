import * as restClient from './restClient'
import * as taskConverters from './converters/taskConverters'
import { TodoistApi } from '.'
import { mock } from 'jest-mock-extended'
import { AxiosResponse } from 'axios'
import { Task } from './types'
import { DEFAULT_QUICK_ADD_RESPONSE, DEFAULT_TASK } from './testData/testDefaults'
import {
    API_REST_BASE_URI,
    API_SYNC_BASE_URI,
    ENDPOINT_REST_TASKS,
    ENDPOINT_SYNC_QUICK_ADD,
} from './consts/endpoints'

const DEFAULT_AUTH_TOKEN = 'AToken'

const setupRestClientMock = (responseData: unknown) => {
    const response = mock<AxiosResponse>({ data: responseData })
    return {
        getMock: jest.spyOn(restClient, 'get').mockResolvedValue(response),
        postMock: jest.spyOn(restClient, 'post').mockResolvedValue(response),
    }
}

const setupSyncTaskConverter = (returnedTask: Task) => {
    return jest.spyOn(taskConverters, 'getTaskFromQuickAddResponse').mockReturnValue(returnedTask)
}

const getTarget = () => {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi', () => {
    describe('addTask', () => {
        const DEFAULT_ADD_TASK_ARGS = {
            content: 'This is a task',
        }

        test('calls post on restClient with expected parameters', async () => {
            const { postMock } = setupRestClientMock(DEFAULT_TASK)
            const api = getTarget()
            await api.addTask(DEFAULT_ADD_TASK_ARGS)

            expect(postMock).toBeCalledTimes(1)
            expect(postMock).toBeCalledWith(
                API_REST_BASE_URI,
                ENDPOINT_REST_TASKS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_ADD_TASK_ARGS,
            )
        })

        test('returns data from restClient post response', async () => {
            setupRestClientMock(DEFAULT_TASK)

            const api = getTarget()
            const task = await api.addTask(DEFAULT_ADD_TASK_ARGS)

            expect(task).toEqual(DEFAULT_TASK)
        })
    })

    describe('quickAddTask', () => {
        const DEFAULT_QUICK_ADD_TEXT = 'This is a quick add text'

        test('calls sync endpoint with expected parameters', async () => {
            const { postMock } = setupRestClientMock(DEFAULT_QUICK_ADD_RESPONSE)
            const api = getTarget()
            await api.quickAddTask(DEFAULT_QUICK_ADD_TEXT)

            expect(postMock).toBeCalledTimes(1)
            expect(postMock).toBeCalledWith(
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
            const { getMock } = setupRestClientMock(DEFAULT_TASK)
            const api = getTarget()
            await api.getTask(taskId)

            expect(getMock).toBeCalledTimes(1)
            expect(getMock).toBeCalledWith(
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
            const { getMock } = setupRestClientMock(DEFAULT_TASK)
            const api = getTarget()
            await api.getTasks(DEFAULT_GET_TASKS_ARGS)

            expect(getMock).toBeCalledTimes(1)
            expect(getMock).toBeCalledWith(
                API_REST_BASE_URI,
                ENDPOINT_REST_TASKS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_GET_TASKS_ARGS,
            )
        })
    })
})
