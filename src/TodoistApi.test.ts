import * as restClient from './restClient'
import { TodoistApi } from '.'
import { mock } from 'jest-mock-extended'
import { AxiosResponse } from 'axios'
import { Task } from './types/entities'

const API_BASE_URI = 'https://api.todoist.com/rest/v1/'
const ENDPOINT_TASKS = 'tasks'
const DEFAULT_AUTH_TOKEN = 'AToken'

const DEFAULT_ADD_TASK_ARGS = {
    content: 'This is a task',
}

const DEFAULT_TASK_RESPONSE = {
    id: 1234,
    content: 'This is a task',
}

const setupRestClientMock = () => {
    const response = mock<AxiosResponse<Task>>({ data: DEFAULT_TASK_RESPONSE })
    return jest.spyOn(restClient, 'post').mockResolvedValue(response)
}

const getTarget = () => {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('restClient', () => {
    const restClientMock = setupRestClientMock()

    test('addTask calls post on restClient with expected parameters', async () => {
        const api = getTarget()
        await api.addTask(DEFAULT_ADD_TASK_ARGS)

        expect(restClientMock).toBeCalledTimes(1)
        expect(restClientMock).toBeCalledWith(
            API_BASE_URI,
            ENDPOINT_TASKS,
            DEFAULT_ADD_TASK_ARGS,
            DEFAULT_AUTH_TOKEN,
        )
    })

    test('addTask returns data from restClient post response', async () => {
        const api = getTarget()
        const task = await api.addTask(DEFAULT_ADD_TASK_ARGS)

        expect(task).toEqual(DEFAULT_TASK_RESPONSE)
    })
})
