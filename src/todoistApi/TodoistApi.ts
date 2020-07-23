import { Task } from './types/entities'
import { post } from './restClient'
import { AddTaskArgs } from './types/requests'

const API_BASE_URI = 'https://api.todoist.com/rest/v1/'
const ENDPOINT_TASKS = 'tasks'

export class TodoistApi {
    authToken: string

    constructor(authToken: string) {
        this.authToken = authToken
    }

    async addTask(args: AddTaskArgs): Promise<Task> {
        const response = await post<Task>(API_BASE_URI, ENDPOINT_TASKS, args, this.authToken)
        return response.data
    }
}
