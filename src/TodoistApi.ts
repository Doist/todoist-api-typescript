import {
    Task,
    QuickAddTaskResponse,
    Project,
    Label,
    User,
    Section,
    Comment,
    EntityId,
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
        EntityId.check(id)
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

    async addTask(args: AddTaskArgs): Promise<Task> {
        const response = await request<Task>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_TASKS,
            this.authToken,
            args,
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

    async updateTask(id: number, args: UpdateTaskArgs): Promise<boolean> {
        EntityId.check(id)
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
        EntityId.check(id)
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id), ENDPOINT_REST_TASK_CLOSE),
            this.authToken,
        )
        return isSuccess(response)
    }

    async reopenTask(id: number): Promise<boolean> {
        EntityId.check(id)
        const response = await request(
            'POST',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id), ENDPOINT_REST_TASK_REOPEN),
            this.authToken,
        )
        return isSuccess(response)
    }

    async deleteTask(id: number): Promise<boolean> {
        EntityId.check(id)
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_TASKS, String(id)),
            this.authToken,
        )
        return isSuccess(response)
    }

    async getProject(id: number): Promise<Project> {
        EntityId.check(id)
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

    async addProject(args: AddProjectArgs): Promise<Project> {
        const response = await request<Project>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_PROJECTS,
            this.authToken,
            args,
        )

        return validateProject(response.data)
    }

    async updateProject(id: number, args: UpdateProjectArgs): Promise<boolean> {
        EntityId.check(id)
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
        EntityId.check(id)
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_PROJECTS, String(id)),
            this.authToken,
        )
        return isSuccess(response)
    }

    async getProjectCollaborators(projectId: number): Promise<User[]> {
        EntityId.check(projectId)
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
        EntityId.check(id)
        const response = await request<Section>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_SECTIONS, String(id)),
            this.authToken,
        )

        return validateSection(response.data)
    }

    async addSection(args: AddSectionArgs): Promise<Section> {
        const response = await request<Section>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_SECTIONS,
            this.authToken,
            args,
        )

        return validateSection(response.data)
    }

    async updateSection(id: number, args: UpdateSectionArgs): Promise<boolean> {
        EntityId.check(id)
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
        EntityId.check(id)
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_SECTIONS, String(id)),
            this.authToken,
        )
        return isSuccess(response)
    }

    async getLabel(id: number): Promise<Label> {
        EntityId.check(id)
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

    async addLabel(args: AddLabelArgs): Promise<Label> {
        const response = await request<Label>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_LABELS,
            this.authToken,
            args,
        )

        return validateLabel(response.data)
    }

    async updateLabel(id: number, args: UpdateLabelArgs): Promise<boolean> {
        EntityId.check(id)
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
        EntityId.check(id)
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

        return validateCommentArray(response.data)
    }

    async getComment(id: number): Promise<Comment> {
        EntityId.check(id)
        const response = await request<Comment>(
            'GET',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_COMMENTS, String(id)),
            this.authToken,
        )

        return validateComment(response.data)
    }

    async addComment(args: AddTaskCommentArgs | AddProjectCommentArgs): Promise<Comment> {
        const response = await request<Comment>(
            'POST',
            API_REST_BASE_URI,
            ENDPOINT_REST_COMMENTS,
            this.authToken,
            args,
        )

        return validateComment(response.data)
    }

    async updateComment(id: number, args: UpdateCommentArgs): Promise<boolean> {
        EntityId.check(id)
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
        EntityId.check(id)
        const response = await request(
            'DELETE',
            API_REST_BASE_URI,
            urljoin(ENDPOINT_REST_COMMENTS, String(id)),
            this.authToken,
        )
        return isSuccess(response)
    }
}
