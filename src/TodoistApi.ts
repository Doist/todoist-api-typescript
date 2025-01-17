import { String } from 'runtypes'
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
    AddCommentArgs,
    AddLabelArgs,
    AddProjectArgs,
    AddSectionArgs,
    AddTaskArgs,
    GetProjectCommentsArgs,
    GetTaskCommentsArgs,
    GetTasksArgs,
    UpdateCommentArgs,
    UpdateLabelArgs,
    UpdateProjectArgs,
    UpdateSectionArgs,
    UpdateTaskArgs,
    QuickAddTaskArgs,
    GetSharedLabelsArgs,
    RenameSharedLabelArgs,
    RemoveSharedLabelArgs,
    GetProjectsArgs,
    GetProjectCollaboratorsArgs,
    GetSections,
    GetLabelsArgs,
} from './types/requests'
import { request, isSuccess } from './restClient'
import { getTaskFromQuickAddResponse } from './utils/taskConverters'
import {
    getSyncBaseUri,
    ENDPOINT_REST_TASKS,
    ENDPOINT_REST_PROJECTS,
    ENDPOINT_SYNC_QUICK_ADD,
    ENDPOINT_REST_TASK_CLOSE,
    ENDPOINT_REST_TASK_REOPEN,
    ENDPOINT_REST_LABELS,
    ENDPOINT_REST_PROJECT_COLLABORATORS,
    ENDPOINT_REST_SECTIONS,
    ENDPOINT_REST_COMMENTS,
    ENDPOINT_REST_LABELS_SHARED,
    ENDPOINT_REST_LABELS_SHARED_RENAME,
    ENDPOINT_REST_LABELS_SHARED_REMOVE,
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

/**
 * Joins path segments using `/` separator.
 * @param segments A list of **valid** path segments.
 * @returns A joined path.
 */
function generatePath(...segments: string[]): string {
    return segments.join('/')
}

export class TodoistApi {
    authToken: string

    constructor(authToken: string, baseUrl?: string) {
        this.authToken = authToken
        this.syncApiBase = getSyncBaseUri(baseUrl)
    }

    private syncApiBase: string

    async getTask(id: string): Promise<Task> {
        String.check(id)
        const response = await request<Task>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_TASKS, id),
            this.authToken,
        )

        return validateTask(response.data)
    }

    async getTasks(args: GetTasksArgs = {}): Promise<{
        results: Task[]
        nextCursor: string | null
    }> {
        const {
            data: { results, nextCursor },
        } = await request<{
            results: Task[]
            nextCursor: string | null
        }>('GET', this.syncApiBase, ENDPOINT_REST_TASKS, this.authToken, args)

        return {
            results: validateTaskArray(results),
            nextCursor,
        }
    }

    async addTask(args: AddTaskArgs, requestId?: string): Promise<Task> {
        const response = await request<Task>(
            'POST',
            this.syncApiBase,
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
            this.syncApiBase,
            ENDPOINT_SYNC_QUICK_ADD,
            this.authToken,
            args,
        )

        const task = getTaskFromQuickAddResponse(response.data)

        return validateTask(task)
    }

    async updateTask(id: string, args: UpdateTaskArgs, requestId?: string): Promise<Task> {
        String.check(id)
        const response = await request(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_TASKS, id),
            this.authToken,
            args,
            requestId,
        )
        return validateTask(response.data)
    }

    async closeTask(id: string, requestId?: string): Promise<boolean> {
        String.check(id)
        const response = await request(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_TASKS, id, ENDPOINT_REST_TASK_CLOSE),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    async reopenTask(id: string, requestId?: string): Promise<boolean> {
        String.check(id)
        const response = await request(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_TASKS, id, ENDPOINT_REST_TASK_REOPEN),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    async deleteTask(id: string, requestId?: string): Promise<boolean> {
        String.check(id)
        const response = await request(
            'DELETE',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_TASKS, id),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    async getProject(id: string): Promise<Project> {
        String.check(id)
        const response = await request<Project>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_PROJECTS, id),
            this.authToken,
        )

        return validateProject(response.data)
    }

    async getProjects(
        args: GetProjectsArgs = {},
    ): Promise<{ results: Project[]; nextCursor: string | null }> {
        const {
            data: { results, nextCursor },
        } = await request<{ results: Project[]; nextCursor: string | null }>(
            'GET',
            this.syncApiBase,
            ENDPOINT_REST_PROJECTS,
            this.authToken,
            args,
        )

        return {
            results: validateProjectArray(results),
            nextCursor,
        }
    }

    async addProject(args: AddProjectArgs, requestId?: string): Promise<Project> {
        const response = await request<Project>(
            'POST',
            this.syncApiBase,
            ENDPOINT_REST_PROJECTS,
            this.authToken,
            args,
            requestId,
        )

        return validateProject(response.data)
    }

    async updateProject(id: string, args: UpdateProjectArgs, requestId?: string): Promise<Project> {
        String.check(id)
        const response = await request(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_PROJECTS, id),
            this.authToken,
            args,
            requestId,
        )
        return validateProject(response.data)
    }

    async deleteProject(id: string, requestId?: string): Promise<boolean> {
        String.check(id)
        const response = await request(
            'DELETE',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_PROJECTS, id),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    async getProjectCollaborators(
        projectId: string,
        args: GetProjectCollaboratorsArgs = {},
    ): Promise<{ results: User[]; nextCursor: string | null }> {
        String.check(projectId)
        const {
            data: { results, nextCursor },
        } = await request<{ results: User[]; nextCursor: string | null }>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_PROJECTS, projectId, ENDPOINT_REST_PROJECT_COLLABORATORS),
            this.authToken,
            args,
        )

        return {
            results: validateUserArray(results),
            nextCursor,
        }
    }

    async getSections(
        args: GetSections,
    ): Promise<{ results: Section[]; nextCursor: string | null }> {
        const {
            data: { results, nextCursor },
        } = await request<{ results: Section[]; nextCursor: string | null }>(
            'GET',
            this.syncApiBase,
            ENDPOINT_REST_SECTIONS,
            this.authToken,
            args,
        )

        return {
            results: validateSectionArray(results),
            nextCursor,
        }
    }

    async getSection(id: string): Promise<Section> {
        String.check(id)
        const response = await request<Section>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_SECTIONS, id),
            this.authToken,
        )

        return validateSection(response.data)
    }

    async addSection(args: AddSectionArgs, requestId?: string): Promise<Section> {
        const response = await request<Section>(
            'POST',
            this.syncApiBase,
            ENDPOINT_REST_SECTIONS,
            this.authToken,
            args,
            requestId,
        )

        return validateSection(response.data)
    }

    async updateSection(id: string, args: UpdateSectionArgs, requestId?: string): Promise<Section> {
        String.check(id)
        const response = await request(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_SECTIONS, id),
            this.authToken,
            args,
            requestId,
        )
        return validateSection(response.data)
    }

    async deleteSection(id: string, requestId?: string): Promise<boolean> {
        String.check(id)
        const response = await request(
            'DELETE',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_SECTIONS, id),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    /**
     * Fetches a personal label
     */
    async getLabel(id: string): Promise<Label> {
        String.check(id)
        const response = await request<Label>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_LABELS, id),
            this.authToken,
        )

        return validateLabel(response.data)
    }

    /**
     * Fetches the personal labels
     */
    async getLabels(
        args: GetLabelsArgs = {},
    ): Promise<{ results: Label[]; nextCursor: string | null }> {
        const {
            data: { results, nextCursor: nextCursor },
        } = await request<{ results: Label[]; nextCursor: string | null }>(
            'GET',
            this.syncApiBase,
            ENDPOINT_REST_LABELS,
            this.authToken,
            args,
        )

        return {
            results: validateLabelArray(results),
            nextCursor,
        }
    }

    /**
     * Adds a personal label
     */
    async addLabel(args: AddLabelArgs, requestId?: string): Promise<Label> {
        const response = await request<Label>(
            'POST',
            this.syncApiBase,
            ENDPOINT_REST_LABELS,
            this.authToken,
            args,
            requestId,
        )

        return validateLabel(response.data)
    }

    /**
     * Updates a personal label
     */
    async updateLabel(id: string, args: UpdateLabelArgs, requestId?: string): Promise<Label> {
        String.check(id)
        const response = await request(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_LABELS, id),
            this.authToken,
            args,
            requestId,
        )
        return validateLabel(response.data)
    }

    /**
     * Deletes a personal label
     */
    async deleteLabel(id: string, requestId?: string): Promise<boolean> {
        String.check(id)
        const response = await request(
            'DELETE',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_LABELS, id),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }

    async getSharedLabels(
        args?: GetSharedLabelsArgs,
    ): Promise<{ results: string[]; nextCursor: string | null }> {
        const {
            data: { results, nextCursor: nextCursor },
        } = await request<{ results: string[]; nextCursor: string | null }>(
            'GET',
            this.syncApiBase,
            ENDPOINT_REST_LABELS_SHARED,
            this.authToken,
            args,
        )

        return { results, nextCursor }
    }

    async renameSharedLabel(args: RenameSharedLabelArgs): Promise<boolean> {
        const response = await request<void>(
            'POST',
            this.syncApiBase,
            ENDPOINT_REST_LABELS_SHARED_RENAME,
            this.authToken,
            args,
        )

        return isSuccess(response)
    }

    async removeSharedLabel(args: RemoveSharedLabelArgs): Promise<boolean> {
        const response = await request<void>(
            'POST',
            this.syncApiBase,
            ENDPOINT_REST_LABELS_SHARED_REMOVE,
            this.authToken,
            args,
        )

        return isSuccess(response)
    }

    async getComments(
        args: GetTaskCommentsArgs | GetProjectCommentsArgs,
    ): Promise<{ results: Comment[]; nextCursor: string | null }> {
        const {
            data: { results, nextCursor },
        } = await request<{ results: Comment[]; nextCursor: string | null }>(
            'GET',
            this.syncApiBase,
            ENDPOINT_REST_COMMENTS,
            this.authToken,
            args,
        )

        return {
            results: validateCommentArray(results),
            nextCursor,
        }
    }

    async getComment(id: string): Promise<Comment> {
        String.check(id)
        const response = await request<Comment>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_COMMENTS, id),
            this.authToken,
        )

        return validateComment(response.data)
    }

    async addComment(args: AddCommentArgs, requestId?: string): Promise<Comment> {
        const response = await request<Comment>(
            'POST',
            this.syncApiBase,
            ENDPOINT_REST_COMMENTS,
            this.authToken,
            args,
            requestId,
        )

        return validateComment(response.data)
    }

    async updateComment(id: string, args: UpdateCommentArgs, requestId?: string): Promise<Comment> {
        String.check(id)
        const response = await request<boolean>(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_COMMENTS, id),
            this.authToken,
            args,
            requestId,
        )
        return validateComment(response.data)
    }

    async deleteComment(id: string, requestId?: string): Promise<boolean> {
        String.check(id)
        const response = await request(
            'DELETE',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_COMMENTS, id),
            this.authToken,
            undefined,
            requestId,
        )
        return isSuccess(response)
    }
}
