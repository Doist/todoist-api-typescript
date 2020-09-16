import { Task, QuickAddTaskResponse, Project, Label, User, Section } from './types/entities'
import {
    AddLabelArgs,
    AddProjectArgs,
    AddSectionArgs,
    AddTaskArgs,
    GetTasksArgs,
    UpdateLabelArgs,
    UpdateProjectArgs,
    UpdateSectionArgs,
    UpdateTaskArgs,
} from './types/requests'
import { request, isSuccess } from './restClient'
import { getTaskFromQuickAddResponse } from './utils/taskConverters'
import urljoin from 'url-join'
import {
    API_REST_BASE_URI,
    API_SYNC_BASE_URI,
    ENDPOINT_REST_TASKS,
    ENDPOINT_REST_PROJECTS,
    ENDPOINT_SYNC_QUICK_ADD,
    ENDPOINT_REST_TASK_CLOSE,
    ENDPOINT_REST_TASK_REOPEN,
    ENDPOINT_REST_LABELS,
    ENDPOINT_REST_PROJECT_COLLABORATORS,
    ENDPOINT_REST_SECTIONS,
} from './consts/endpoints'

export class TodoistApi {
    authToken: string

    constructor(authToken: string) {
        this.authToken = authToken
    }

    async getTask(id: number): Promise<Task> {
        const response = await request<Task>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id)),
            this.authToken,
        )
        return response.data
    }

    async getTasks(args?: GetTasksArgs): Promise<Task[]> {
        const response = await request<Task[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_TASKS,
            this.authToken,
            args,
        )
        return response.data
    }

    async addTask(args: AddTaskArgs): Promise<Task> {
        const response = await request<Task>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_TASKS,
            this.authToken,
            args,
        )
        return response.data
    }

    async quickAddTask(text: string): Promise<Task> {
        const response = await request<QuickAddTaskResponse>(
            'POST',
            API_SYNC_BASE_URI,
            ENDPOINT_SYNC_QUICK_ADD,
            this.authToken,
            { text },
        )
        return getTaskFromQuickAddResponse(response.data)
    }

    async updateTask(id: number, args: UpdateTaskArgs): Promise<boolean> {
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id)),
            this.authToken,
            args,
        )
        return isSuccess(response)
    }

    async closeTask(id: number): Promise<boolean> {
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id), ENDPOINT_REST_TASK_CLOSE),
            this.authToken,
        )
        return isSuccess(response)
    }

    async reopenTask(id: number): Promise<boolean> {
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id), ENDPOINT_REST_TASK_REOPEN),
            this.authToken,
        )
        return isSuccess(response)
    }

    async deleteTask(id: number): Promise<boolean> {
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id)),
            this.authToken,
        )
        return isSuccess(response)
    }

    async getProject(id: number): Promise<Project> {
        const response = await request<Project>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_PROJECTS, String(id)),
            this.authToken,
        )
        return response.data
    }

    async getProjects(): Promise<Project[]> {
        const response = await request<Project[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_PROJECTS,
            this.authToken,
        )
        return response.data
    }

    async addProject(args: AddProjectArgs): Promise<Project> {
        const response = await request<Project>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_PROJECTS,
            this.authToken,
            args,
        )
        return response.data
    }

    async updateProject(id: number, args: UpdateProjectArgs): Promise<boolean> {
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_PROJECTS, String(id)),
            this.authToken,
            args,
        )
        return isSuccess(response)
    }

    async deleteProject(id: number): Promise<boolean> {
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_PROJECTS, String(id)),
            this.authToken,
        )
        return isSuccess(response)
    }

    async getProjectCollaborators(projectId: number): Promise<User[]> {
        const response = await request<User[]>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_PROJECTS, String(projectId), ENDPOINT_REST_PROJECT_COLLABORATORS),
            this.authToken,
        )
        return response.data
    }

    async getSections(projectId?: number): Promise<Section[]> {
        const response = await request<Section[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_SECTIONS,
            this.authToken,
            projectId && { projectId },
        )
        return response.data
    }

    async getSection(id: number): Promise<Section> {
        const response = await request<Section>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_SECTIONS, String(id)),
            this.authToken,
        )
        return response.data
    }

    async addSection(args: AddSectionArgs): Promise<Section> {
        const response = await request<Section>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_SECTIONS,
            this.authToken,
            args,
        )
        return response.data
    }

    async updateSection(id: number, args: UpdateSectionArgs): Promise<boolean> {
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_SECTIONS, String(id)),
            this.authToken,
            args,
        )
        return isSuccess(response)
    }

    async deleteSection(id: number): Promise<boolean> {
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_SECTIONS, String(id)),
            this.authToken,
        )
        return isSuccess(response)
    }

    async getLabel(id: number): Promise<Label> {
        const response = await request<Label>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_LABELS, String(id)),
            this.authToken,
        )
        return response.data
    }

    async getLabels(): Promise<Label[]> {
        const response = await request<Label[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_LABELS,
            this.authToken,
        )
        return response.data
    }

    async addLabel(args: AddLabelArgs): Promise<Label> {
        const response = await request<Label>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_LABELS,
            this.authToken,
            args,
        )
        return response.data
    }

    async updateLabel(id: number, args: UpdateLabelArgs): Promise<boolean> {
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_LABELS, String(id)),
            this.authToken,
            args,
        )
        return isSuccess(response)
    }

    async deleteLabel(id: number): Promise<boolean> {
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_LABELS, String(id)),
            this.authToken,
        )
        return isSuccess(response)
    }
}
