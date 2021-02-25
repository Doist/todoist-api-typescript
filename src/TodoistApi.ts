import {
    Task,
    QuickAddTaskResponse,
    Project,
    Label,
    User,
    Section,
    Comment,
    Int,
} from './types/entities'
import {
    AddLabelArgs,
    AddProjectArgs,
    AddSectionArgs,
    AddProjectCommentArgs,
    AddTaskArgs,
    AddTaskCommentArgs,
    GetProjectCommentsArgs,
    GetTaskCommentsArgs,
    GetTasksArgs,
    UpdateCommentArgs,
    UpdateLabelArgs,
    UpdateProjectArgs,
    UpdateSectionArgs,
    UpdateTaskArgs,
    QuickAddTaskArgs,
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
    ENDPOINT_REST_COMMENTS,
} from './consts/endpoints'
import {
    validateComment,
    validateCommentArray,
    validateLabel,
    validateLabelArray,
    validateProject,
    validateProjectArray,
    validateSection,
    validateSectionArray,
    validateTask,
    validateTaskArray,
    validateUserArray,
} from './utils/validators'

export class TodoistApi {
    authToken: string

    constructor(authToken: string) {
        this.authToken = authToken
    }

    async getTask(id: number): Promise<Task> {
        Int.check(id)
        const response = await request<Task>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id)),
            this.authToken,
        )

        return validateTask(response.data)
    }

    async getTasks(args?: GetTasksArgs): Promise<Task[]> {
        const response = await request<Task[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_TASKS,
            this.authToken,
            args,
        )

        return validateTaskArray(response.data)
    }

    async addTask(args: AddTaskArgs, requestId?: string): Promise<Task> {
        const response = await request<Task>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_TASKS,
            this.authToken,
            args,
            requestId,
        )

        return validateTask(response.data)
    }

    async quickAddTask(args: QuickAddTaskArgs): Promise<Task> {
        const response = await request<QuickAddTaskResponse>(
            'POST',
            API_SYNC_BASE_URI,
            ENDPOINT_SYNC_QUICK_ADD,
            this.authToken,
            args,
        )

        const task = getTaskFromQuickAddResponse(response.data)

        return validateTask(task)
    }

    async updateTask(id: number, args: UpdateTaskArgs, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id)),
            this.authToken,
            args,
            requestId,
        )
        return isSuccess(response)
    }

    async closeTask(id: number, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id), ENDPOINT_REST_TASK_CLOSE),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    async reopenTask(id: number, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id), ENDPOINT_REST_TASK_REOPEN),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    async deleteTask(id: number, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id)),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    async getProject(id: number): Promise<Project> {
        Int.check(id)
        const response = await request<Project>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_PROJECTS, String(id)),
            this.authToken,
        )

        return validateProject(response.data)
    }

    async getProjects(): Promise<Project[]> {
        const response = await request<Project[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_PROJECTS,
            this.authToken,
        )

        return validateProjectArray(response.data)
    }

    async addProject(args: AddProjectArgs, requestId?: string): Promise<Project> {
        const response = await request<Project>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_PROJECTS,
            this.authToken,
            args,
            requestId,
        )

        return validateProject(response.data)
    }

    async updateProject(id: number, args: UpdateProjectArgs, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_PROJECTS, String(id)),
            this.authToken,
            args,
            requestId,
        )
        return isSuccess(response)
    }

    async deleteProject(id: number, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_PROJECTS, String(id)),
            this.authToken,
            requestId,
        )
        return isSuccess(response)
    }

    async getProjectCollaborators(projectId: number): Promise<User[]> {
        Int.check(projectId)
        const response = await request<User[]>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_PROJECTS, String(projectId), ENDPOINT_REST_PROJECT_COLLABORATORS),
            this.authToken,
        )

        return validateUserArray(response.data)
    }

    async getSections(projectId?: number): Promise<Section[]> {
        const response = await request<Section[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_SECTIONS,
            this.authToken,
            projectId && { projectId },
        )

        return validateSectionArray(response.data)
    }

    async getSection(id: number): Promise<Section> {
        Int.check(id)
        const response = await request<Section>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_SECTIONS, String(id)),
            this.authToken,
        )

        return validateSection(response.data)
    }

    async addSection(args: AddSectionArgs, requestId?: string): Promise<Section> {
        const response = await request<Section>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_SECTIONS,
            this.authToken,
            args,
            requestId,
        )

        return validateSection(response.data)
    }

    async updateSection(id: number, args: UpdateSectionArgs, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_SECTIONS, String(id)),
            this.authToken,
            args,
            requestId,
        )
        return isSuccess(response)
    }

    async deleteSection(id: number, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_SECTIONS, String(id)),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    async getLabel(id: number): Promise<Label> {
        Int.check(id)
        const response = await request<Label>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_LABELS, String(id)),
            this.authToken,
        )

        return validateLabel(response.data)
    }

    async getLabels(): Promise<Label[]> {
        const response = await request<Label[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_LABELS,
            this.authToken,
        )

        return validateLabelArray(response.data)
    }

    async addLabel(args: AddLabelArgs, requestId?: string): Promise<Label> {
        const response = await request<Label>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_LABELS,
            this.authToken,
            args,
            requestId,
        )

        return validateLabel(response.data)
    }

    async updateLabel(id: number, args: UpdateLabelArgs, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_LABELS, String(id)),
            this.authToken,
            args,
            requestId,
        )
        return isSuccess(response)
    }

    async deleteLabel(id: number, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_LABELS, String(id)),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    async getComments(args: GetTaskCommentsArgs | GetProjectCommentsArgs): Promise<Comment[]> {
        const response = await request<Comment[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_COMMENTS,
            this.authToken,
            args,
        )

        return validateCommentArray(response.data)
    }

    async getComment(id: number): Promise<Comment> {
        Int.check(id)
        const response = await request<Comment>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_COMMENTS, String(id)),
            this.authToken,
        )

        return validateComment(response.data)
    }

    async addComment(
        args: AddTaskCommentArgs | AddProjectCommentArgs,
        requestId?: string,
    ): Promise<Comment> {
        const response = await request<Comment>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_COMMENTS,
            this.authToken,
            args,
            requestId,
        )

        return validateComment(response.data)
    }

    async updateComment(id: number, args: UpdateCommentArgs, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request<boolean>(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_COMMENTS, String(id)),
            this.authToken,
            args,
            requestId,
        )
        return isSuccess(response)
    }

    async deleteComment(id: number, requestId?: string): Promise<boolean> {
        Int.check(id)
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_COMMENTS, String(id)),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }
}
