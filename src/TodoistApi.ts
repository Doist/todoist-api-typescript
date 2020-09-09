import { Task, QuickAddTaskResponse, Project } from './types/entities'
import { AddTaskArgs, GetTasksArgs } from './types/requests'
import { post, get } from './restClient'
import { getTaskFromQuickAddResponse } from './converters/taskConverters'
import {
    API_REST_BASE_URI,
    API_SYNC_BASE_URI,
    ENDPOINT_REST_TASKS,
    ENDPOINT_REST_PROJECTS,
    ENDPOINT_SYNC_QUICK_ADD,
} from './consts/endpoints'

export class TodoistApi {
    authToken: string

    constructor(authToken: string) {
        this.authToken = authToken
    }

    async addTask(args: AddTaskArgs): Promise<Task> {
        const response = await post<Task>(
            API_REST_BASE_URI,
            ENDPOINT_REST_TASKS,
            this.authToken,
            args,
        )
        return response.data
    }

    async quickAddTask(text: string): Promise<Task> {
        const response = await post<QuickAddTaskResponse>(
            API_SYNC_BASE_URI,
            ENDPOINT_SYNC_QUICK_ADD,
            this.authToken,
            { text },
        )
        return getTaskFromQuickAddResponse(response.data)
    }

    async getTask(id: number): Promise<Task> {
        const response = await get<Task>(
            API_REST_BASE_URI,
            `${ENDPOINT_REST_TASKS}/${id}`,
            this.authToken,
        )
        return response.data
    }

    async getTasks(args?: GetTasksArgs): Promise<Task[]> {
        const response = await get<Task[]>(
            API_REST_BASE_URI,
            ENDPOINT_REST_TASKS,
            this.authToken,
            args,
        )
        return response.data
    }

    async getProject(id: number): Promise<Project> {
        const response = await get<Project>(
            API_REST_BASE_URI,
            `${ENDPOINT_REST_PROJECTS}/${id}`,
            this.authToken,
        )
        return response.data
    }

    async getProjects(): Promise<Project[]> {
        const response = await get<Project[]>(
            API_REST_BASE_URI,
            ENDPOINT_REST_PROJECTS,
            this.authToken,
        )
        return response.data
    }
}
