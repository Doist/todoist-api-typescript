import {
    Task,
    QuickAddTaskResponse,
    Project,
    Label,
    User,
    Section,
    Comment,
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
        const response = await request<Task>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id)),
            this.authToken,
        )

        validateTask(response.data)

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

        validateTaskArray(response.data)

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

        validateTask(response.data)

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

        const task = getTaskFromQuickAddResponse(response.data)

        validateTask(task)

        return task
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

        validateProject(response.data)

        return response.data
    }

    async getProjects(): Promise<Project[]> {
        const response = await request<Project[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_PROJECTS,
            this.authToken,
        )

        validateProjectArray(response.data)

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

        validateProject(response.data)

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

        validateUserArray(response.data)

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

        validateSectionArray(response.data)

        return response.data
    }

    async getSection(id: number): Promise<Section> {
        const response = await request<Section>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_SECTIONS, String(id)),
            this.authToken,
        )

        validateSection(response.data)

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

        validateSection(response.data)

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

        validateLabel(response.data)

        return response.data
    }

    async getLabels(): Promise<Label[]> {
        const response = await request<Label[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_LABELS,
            this.authToken,
        )

        validateLabelArray(response.data)

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

        validateLabel(response.data)

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

    async getComments(args: GetTaskCommentsArgs | GetProjectCommentsArgs): Promise<Comment[]> {
        const response = await request<Comment[]>(
            'GET',
            API_REST_BASE_URI,
            ENDPOINT_REST_COMMENTS,
            this.authToken,
            args,
        )

        validateCommentArray(response.data)

        return response.data
    }

    async getComment(id: number): Promise<Comment> {
        const response = await request<Comment>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_COMMENTS, String(id)),
            this.authToken,
        )

        validateComment(response.data)

        return response.data
    }

    async addComment(args: AddTaskCommentArgs | AddProjectCommentArgs): Promise<Comment> {
        const response = await request<Comment>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_COMMENTS,
            this.authToken,
            args,
        )

        validateComment(response.data)

        return response.data
    }

    async updateComment(id: number, args: UpdateCommentArgs): Promise<boolean> {
        const response = await request<boolean>(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_COMMENTS, String(id)),
            this.authToken,
            args,
        )
        return isSuccess(response)
    }

    async deleteComment(id: number): Promise<boolean> {
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_COMMENTS, String(id)),
            this.authToken,
        )
        return isSuccess(response)
    }
}
