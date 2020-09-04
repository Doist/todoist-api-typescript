import * as restClient from './restClient'
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

const DEFAULT_AUTH_TOKEN = 'AToken'

const DEFAULT_QUICK_ADD_TEXT = 'This is a quick add text'
const DEFAULT_ADD_TASK_ARGS = {
    content: 'This is a task',
}

const DEFAULT_TASK_RESPONSE = {
    id: 1234,
    content: 'This is a rest task',
}

const setupRestClientMock = () => {
    const response = mock<AxiosResponse<Task>>({ data: DEFAULT_TASK_RESPONSE })
    return jest.spyOn(restClient, 'post').mockResolvedValue(response)
}

const getTarget = () => {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi REST calls', () => {
    const restClientMock = setupRestClientMock()

    test('addTask calls post on restClient with expected parameters', async () => {
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
        const api = getTarget()
        const task = await api.addTask(DEFAULT_ADD_TASK_ARGS)

        expect(task).toEqual(DEFAULT_TASK_RESPONSE)
    })

    test('quickAddTask calls sync endpoint with expected parameters', async () => {
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

    test('quickAddTask returns data from post response', async () => {
        const api = getTarget()
        const task = await api.quickAddTask(DEFAULT_QUICK_ADD_TEXT)

        expect(task).toEqual(DEFAULT_TASK_RESPONSE)
    })
})
