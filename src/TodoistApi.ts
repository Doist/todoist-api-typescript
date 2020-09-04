import { Task } from './types/entities'
import { post } from './restClient'
import { AddTaskArgs } from './types/requests'

export const API_REST_BASE_URI = 'https://api.todoist.com/rest/v1/'
export const API_SYNC_BASE_URI = 'https://api.todoist.com/sync/v8'

export const ENDPOINT_REST_TASKS = 'tasks'
export const ENDPOINT_SYNC_QUICK_ADD = 'quick/add'

export class TodoistApi {
    authToken: string

    constructor(authToken: string) {
        this.authToken = authToken
    }

    async addTask(args: AddTaskArgs): Promise<Task> {
        const response = await post<Task>(
            API_REST_BASE_URI,
            ENDPOINT_REST_TASKS,
            args,
            this.authToken,
        )
        return response.data
    }

    async quickAddTask(text: string): Promise<Task> {
        const response = await post<Task>(
            API_SYNC_BASE_URI,
            ENDPOINT_SYNC_QUICK_ADD,
            { text },
            this.authToken,
        )
        return response.data
    }
}
