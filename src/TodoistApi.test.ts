import * as restClient from './restClient'
import * as taskConverters from './converters/taskConverters'
import {
    TodoistApi,
    API_REST_BASE_URI,
    ENDPOINT_REST_TASKS,
    API_SYNC_BASE_URI,
    ENDPOINT_SYNC_QUICK_ADD,
} from '.'
import { mock } from 'jest-mock-extended'
import { AxiosResponse } from 'axios'
import { Task } from './types/entities'
import { DEFAULT_QUICK_ADD_RESPONSE, DEFAULT_TASK_RESPONSE } from './testData/testDefaults'

const DEFAULT_AUTH_TOKEN = 'AToken'

const DEFAULT_QUICK_ADD_TEXT = 'This is a quick add text'
const DEFAULT_ADD_TASK_ARGS = {
    content: 'This is a task',
}

const setupRestClientMock = (responseData: unknown) => {
    const response = mock<AxiosResponse>({ data: responseData })
    return jest.spyOn(restClient, 'post').mockResolvedValue(response)
}

const setupSyncTaskConverter = (returnedTask: Task) => {
    return jest.spyOn(taskConverters, 'getTaskFromQuickAddResponse').mockReturnValue(returnedTask)
}

const getTarget = () => {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi', () => {
    test('addTask calls post on restClient with expected parameters', async () => {
        const restClientMock = setupRestClientMock(DEFAULT_TASK_RESPONSE)
        const api = getTarget()
        await api.addTask(DEFAULT_ADD_TASK_ARGS)

        expect(restClientMock).toBeCalledTimes(1)
        expect(restClientMock).toBeCalledWith(
            API_REST_BASE_URI,
            ENDPOINT_REST_TASKS,
            DEFAULT_ADD_TASK_ARGS,
            DEFAULT_AUTH_TOKEN,
        )
    })

    test('addTask returns data from restClient post response', async () => {
        setupRestClientMock(DEFAULT_TASK_RESPONSE)

        const api = getTarget()
        const task = await api.addTask(DEFAULT_ADD_TASK_ARGS)

        expect(task).toEqual(DEFAULT_TASK_RESPONSE)
    })

    test('quickAddTask calls sync endpoint with expected parameters', async () => {
        const restClientMock = setupRestClientMock(DEFAULT_TASK_RESPONSE)
        const api = getTarget()
        await api.quickAddTask(DEFAULT_QUICK_ADD_TEXT)

        expect(restClientMock).toBeCalledTimes(1)
        expect(restClientMock).toBeCalledWith(
            API_SYNC_BASE_URI,
            ENDPOINT_SYNC_QUICK_ADD,
            { text: DEFAULT_QUICK_ADD_TEXT },
            DEFAULT_AUTH_TOKEN,
        )
    })

    test('quickAddTask calls task converter with response data and returns result', async () => {
        setupRestClientMock(DEFAULT_QUICK_ADD_RESPONSE)
        const taskConverter = setupSyncTaskConverter(DEFAULT_TASK_RESPONSE)

        const api = getTarget()
        const task = await api.quickAddTask(DEFAULT_QUICK_ADD_TEXT)

        expect(taskConverter).toBeCalledTimes(1)
        expect(taskConverter).toBeCalledWith(DEFAULT_QUICK_ADD_RESPONSE)
        expect(task).toEqual(DEFAULT_TASK_RESPONSE)
    })
})
