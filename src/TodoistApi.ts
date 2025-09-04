import { PersonalProject, WorkspaceProject, Label, Section, Comment, Task } from './types/entities'
import {
    AddCommentArgs,
    AddLabelArgs,
    AddProjectArgs,
    AddSectionArgs,
    AddTaskArgs,
    GetProjectCommentsArgs,
    GetTaskCommentsArgs,
    GetTasksArgs,
    GetTasksByFilterArgs,
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
    GetLabelsArgs,
    GetLabelsResponse,
    GetTasksResponse,
    GetProjectsResponse,
    GetProjectCollaboratorsResponse,
    GetSectionsArgs,
    GetSectionsResponse,
    GetSharedLabelsResponse,
    GetCommentsResponse,
    type MoveTaskArgs,
    GetCompletedTasksByCompletionDateArgs,
    GetCompletedTasksByDueDateArgs,
    GetCompletedTasksResponse,
} from './types/requests'
import { request, isSuccess } from './restClient'
import {
    getSyncBaseUri,
    ENDPOINT_REST_TASKS,
    ENDPOINT_REST_TASKS_FILTER,
    ENDPOINT_REST_TASKS_COMPLETED_BY_COMPLETION_DATE,
    ENDPOINT_REST_TASKS_COMPLETED_BY_DUE_DATE,
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
    ENDPOINT_SYNC,
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
import { z } from 'zod'

import { v4 as uuidv4 } from 'uuid'
import { SyncResponse, type Command, type SyncRequest } from './types/sync'
import { TodoistRequestError } from './types'

const MAX_COMMAND_COUNT = 100

/**
 * Joins path segments using `/` separator.
 * @param segments A list of **valid** path segments.
 * @returns A joined path.
 */
function generatePath(...segments: string[]): string {
    return segments.join('/')
}

/**
 * A client for interacting with the Todoist API v1.
 * This class provides methods to manage tasks, projects, sections, labels, and comments in Todoist.
 *
 * @example
 * ```typescript
 * const api = new TodoistApi('your-api-token');
 *
 * // Get all tasks
 * const tasks = await api.getTasks();
 *
 * // Create a new task
 * const newTask = await api.addTask({
 *   content: 'My new task',
 *   projectId: '12345'
 * });
 * ```
 *
 * For more information about the Todoist API v1, see the [official documentation](https://todoist.com/api/v1).
 * If you're migrating from v9, please refer to the [migration guide](https://todoist.com/api/v1/docs#tag/Migrating-from-v9).
 */
export class TodoistApi {
    private authToken: string
    private syncApiBase: string

    constructor(
        /**
         * Your Todoist API token.
         */
        authToken: string,
        /**
         * Optional custom API base URL. If not provided, defaults to Todoist's standard API endpoint
         */
        baseUrl?: string,
    ) {
        this.authToken = authToken
        this.syncApiBase = getSyncBaseUri(baseUrl)
    }

    /**
     * Retrieves a single active (non-completed) task by its ID.
     *
     * @param id - The unique identifier of the task.
     * @returns A promise that resolves to the requested task.
     */
    async getTask(id: string): Promise<Task> {
        z.string().parse(id)
        const response = await request<Task>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_TASKS, id),
            this.authToken,
        )

        return validateTask(response.data)
    }

    /**
     * Retrieves a list of active tasks filtered by specific parameters.
     *
     * @param args - Filter parameters such as project ID, label ID, or due date.
     * @returns A promise that resolves to an array of tasks.
     */
    async getTasks(args: GetTasksArgs = {}): Promise<GetTasksResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetTasksResponse>(
            'GET',
            this.syncApiBase,
            ENDPOINT_REST_TASKS,
            this.authToken,
            args,
        )

        return {
            results: validateTaskArray(results),
            nextCursor,
        }
    }

    /**
     * Retrieves tasks filtered by a filter string.
     *
     * @param args - Parameters for filtering tasks, including the query string and optional language.
     * @returns A promise that resolves to a paginated response of tasks.
     */
    async getTasksByFilter(args: GetTasksByFilterArgs): Promise<GetTasksResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetTasksResponse>(
            'GET',
            this.syncApiBase,
            ENDPOINT_REST_TASKS_FILTER,
            this.authToken,
            args,
        )

        return {
            results: validateTaskArray(results),
            nextCursor,
        }
    }

    /**
     * Retrieves completed tasks by completion date.
     *
     * @param args - Parameters for filtering, including required since, until.
     * @returns A promise that resolves to a paginated response of completed tasks.
     */
    async getCompletedTasksByCompletionDate(
        args: GetCompletedTasksByCompletionDateArgs,
    ): Promise<GetCompletedTasksResponse> {
        const {
            data: { items, nextCursor },
        } = await request<GetCompletedTasksResponse>(
            'GET',
            this.syncApiBase,
            ENDPOINT_REST_TASKS_COMPLETED_BY_COMPLETION_DATE,
            this.authToken,
            args,
        )

        return {
            items: validateTaskArray(items),
            nextCursor,
        }
    }

    /**
     * Retrieves completed tasks by due date.
     *
     * @param args - Parameters for filtering, including required since, until.
     * @returns A promise that resolves to a paginated response of completed tasks.
     */
    async getCompletedTasksByDueDate(
        args: GetCompletedTasksByDueDateArgs,
    ): Promise<GetCompletedTasksResponse> {
        const {
            data: { items, nextCursor },
        } = await request<GetCompletedTasksResponse>(
            'GET',
            this.syncApiBase,
            ENDPOINT_REST_TASKS_COMPLETED_BY_DUE_DATE,
            this.authToken,
            args,
        )

        return {
            items: validateTaskArray(items),
            nextCursor,
        }
    }

    /**
     * Creates a new task with the provided parameters.
     *
     * @param args - Task creation parameters such as content, due date, or priority.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created task.
     */
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

    /**
     * Quickly adds a task using natural language processing for due dates.
     *
     * @param args - Quick add task parameters, including content and due date.
     * @returns A promise that resolves to the created task.
     */
    async quickAddTask(args: QuickAddTaskArgs): Promise<Task> {
        const response = await request<Task>(
            'POST',
            this.syncApiBase,
            ENDPOINT_SYNC_QUICK_ADD,
            this.authToken,
            args,
        )

        return validateTask(response.data)
    }

    /**
     * Updates an existing task by its ID with the provided parameters.
     *
     * @param id - The unique identifier of the task to update.
     * @param args - Update parameters such as content, priority, or due date.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated task.
     */
    async updateTask(id: string, args: UpdateTaskArgs, requestId?: string): Promise<Task> {
        z.string().parse(id)
        const response = await request<Task>(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_TASKS, id),
            this.authToken,
            args,
            requestId,
        )

        return validateTask(response.data)
    }

    /**
     * Moves existing tasks by their ID to either a different parent/section/project.
     *
     * @param ids - The unique identifier of the tasks to be moved.
     * @param args - The paramets that should contain only one of projectId, sectionId, or parentId
     * @param requestId - Optional custom identifier for the request.
     * @returns - A promise that resolves to an array of the updated tasks.
     */
    async moveTasks(ids: string[], args: MoveTaskArgs, requestId?: string): Promise<Task[]> {
        if (ids.length > MAX_COMMAND_COUNT) {
            throw new TodoistRequestError(`Maximum number of items is ${MAX_COMMAND_COUNT}`, 400)
        }
        const commands: Command[] = ids.map((id) => ({
            type: 'item_move',
            uuid: uuidv4(),
            args: {
                id,
                ...(args.projectId && { project_id: args.projectId }),
                ...(args.sectionId && { section_id: args.sectionId }),
                ...(args.parentId && { parent_id: args.parentId }),
            },
        }))

        const syncRequest: SyncRequest = {
            commands,
            resource_types: ['items'],
        }

        const response = await request<SyncResponse>(
            'POST',
            this.syncApiBase,
            ENDPOINT_SYNC,
            this.authToken,
            syncRequest,
            requestId,
            /*hasSyncCommands: */ true,
        )

        if (response.data.sync_status) {
            Object.entries(response.data.sync_status).forEach(([_, value]) => {
                if (value === 'ok') return

                throw new TodoistRequestError(value.error, value.http_code, value.error_extra)
            })
        }

        if (!response.data.items?.length) {
            throw new TodoistRequestError('Tasks not found', 404)
        }

        const syncTasks = response.data.items.filter((task) => ids.includes(task.id))
        if (!syncTasks.length) {
            throw new TodoistRequestError('Tasks not found', 404)
        }

        return validateTaskArray(syncTasks)
    }

    /**
     * Closes (completes) a task by its ID.
     *
     * @param id - The unique identifier of the task to close.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async closeTask(id: string, requestId?: string): Promise<boolean> {
        z.string().parse(id)
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

    /**
     * Reopens a previously closed (completed) task by its ID.
     *
     * @param id - The unique identifier of the task to reopen.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async reopenTask(id: string, requestId?: string): Promise<boolean> {
        z.string().parse(id)
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

    /**
     * Deletes a task by its ID.
     *
     * @param id - The unique identifier of the task to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteTask(id: string, requestId?: string): Promise<boolean> {
        z.string().parse(id)
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

    /**
     * Retrieves a project by its ID.
     *
     * @param id - The unique identifier of the project.
     * @returns A promise that resolves to the requested project.
     */
    async getProject(id: string): Promise<PersonalProject | WorkspaceProject> {
        z.string().parse(id)
        const response = await request<PersonalProject | WorkspaceProject>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_PROJECTS, id),
            this.authToken,
        )

        return validateProject(response.data)
    }

    /**
     * Retrieves all projects with optional filters.
     *
     * @param args - Optional filters for retrieving projects.
     * @returns A promise that resolves to an array of projects.
     */
    async getProjects(args: GetProjectsArgs = {}): Promise<GetProjectsResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetProjectsResponse>(
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

    /**
     * Creates a new project with the provided parameters.
     *
     * @param args - Project creation parameters such as name or color.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created project.
     */
    async addProject(
        args: AddProjectArgs,
        requestId?: string,
    ): Promise<PersonalProject | WorkspaceProject> {
        const response = await request<PersonalProject | WorkspaceProject>(
            'POST',
            this.syncApiBase,
            ENDPOINT_REST_PROJECTS,
            this.authToken,
            args,
            requestId,
        )

        return validateProject(response.data)
    }

    /**
     * Updates an existing project by its ID with the provided parameters.
     *
     * @param id - The unique identifier of the project to update.
     * @param args - Update parameters such as name or color.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated project.
     */
    async updateProject(
        id: string,
        args: UpdateProjectArgs,
        requestId?: string,
    ): Promise<PersonalProject | WorkspaceProject> {
        z.string().parse(id)
        const response = await request<PersonalProject | WorkspaceProject>(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_PROJECTS, id),
            this.authToken,
            args,
            requestId,
        )

        return validateProject(response.data)
    }

    /**
     * Deletes a project by its ID.
     *
     * @param id - The unique identifier of the project to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteProject(id: string, requestId?: string): Promise<boolean> {
        z.string().parse(id)
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

    /**
     * Archives a project by its ID.
     *
     * @param id - The unique identifier of the project to archive.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated project.
     */
    async archiveProject(
        id: string,
        requestId?: string,
    ): Promise<PersonalProject | WorkspaceProject> {
        z.string().parse(id)
        const response = await request<PersonalProject | WorkspaceProject>(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_PROJECTS, id, 'archive'),
            this.authToken,
            undefined,
            requestId,
        )
        return validateProject(response.data)
    }

    /**
     * Unarchives a project by its ID.
     *
     * @param id - The unique identifier of the project to unarchive.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated project.
     */
    async unarchiveProject(
        id: string,
        requestId?: string,
    ): Promise<PersonalProject | WorkspaceProject> {
        z.string().parse(id)
        const response = await request<PersonalProject | WorkspaceProject>(
            'POST',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_PROJECTS, id, 'unarchive'),
            this.authToken,
            undefined,
            requestId,
        )
        return validateProject(response.data)
    }

    /**
     * Retrieves a list of collaborators for a specific project.
     *
     * @param projectId - The unique identifier of the project.
     * @param args - Optional parameters to filter collaborators.
     * @returns A promise that resolves to an array of collaborators for the project.
     */
    async getProjectCollaborators(
        projectId: string,
        args: GetProjectCollaboratorsArgs = {},
    ): Promise<GetProjectCollaboratorsResponse> {
        z.string().parse(projectId)
        const {
            data: { results, nextCursor },
        } = await request<GetProjectCollaboratorsResponse>(
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

    /**
     * Retrieves all sections within a specific project or matching criteria.
     *
     * @param args - Filter parameters such as project ID.
     * @returns A promise that resolves to an array of sections.
     */
    async getSections(args: GetSectionsArgs): Promise<GetSectionsResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetSectionsResponse>(
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

    /**
     * Retrieves a single section by its ID.
     *
     * @param id - The unique identifier of the section.
     * @returns A promise that resolves to the requested section.
     */
    async getSection(id: string): Promise<Section> {
        z.string().parse(id)
        const response = await request<Section>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_SECTIONS, id),
            this.authToken,
        )

        return validateSection(response.data)
    }

    /**
     * Creates a new section within a project.
     *
     * @param args - Section creation parameters such as name or project ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created section.
     */
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

    /**
     * Updates a section by its ID with the provided parameters.
     *
     * @param id - The unique identifier of the section to update.
     * @param args - Update parameters such as name or project ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated section.
     */
    async updateSection(id: string, args: UpdateSectionArgs, requestId?: string): Promise<Section> {
        z.string().parse(id)
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

    /**
     * Deletes a section by its ID.
     *
     * @param id - The unique identifier of the section to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteSection(id: string, requestId?: string): Promise<boolean> {
        z.string().parse(id)
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
     * Retrieves a label by its ID.
     *
     * @param id - The unique identifier of the label.
     * @returns A promise that resolves to the requested label.
     */
    async getLabel(id: string): Promise<Label> {
        z.string().parse(id)
        const response = await request<Label>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_LABELS, id),
            this.authToken,
        )

        return validateLabel(response.data)
    }

    /**
     * Retrieves all labels.
     *
     * @param args - Optional filter parameters.
     * @returns A promise that resolves to an array of labels.
     */
    async getLabels(args: GetLabelsArgs = {}): Promise<GetLabelsResponse> {
        const {
            data: { results, nextCursor: nextCursor },
        } = await request<GetLabelsResponse>(
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
     * Adds a new label.
     *
     * @param args - Label creation parameters such as name.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created label.
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
     * Updates an existing label by its ID.
     *
     * @param id - The unique identifier of the label to update.
     * @param args - Update parameters such as name or color.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated label.
     */
    async updateLabel(id: string, args: UpdateLabelArgs, requestId?: string): Promise<Label> {
        z.string().parse(id)
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
     * Deletes a label by its ID.
     *
     * @param id - The unique identifier of the label to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteLabel(id: string, requestId?: string): Promise<boolean> {
        z.string().parse(id)
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

    /**
     * Retrieves a list of shared labels.
     *
     * @param args - Optional parameters to filter shared labels.
     * @returns A promise that resolves to an array of shared labels.
     */
    async getSharedLabels(args?: GetSharedLabelsArgs): Promise<GetSharedLabelsResponse> {
        const {
            data: { results, nextCursor: nextCursor },
        } = await request<GetSharedLabelsResponse>(
            'GET',
            this.syncApiBase,
            ENDPOINT_REST_LABELS_SHARED,
            this.authToken,
            args,
        )

        return { results, nextCursor }
    }

    /**
     * Renames an existing shared label.
     *
     * @param args - Parameters for renaming the shared label, including the current and new name.
     * @returns A promise that resolves to `true` if successful.
     */
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

    /**
     * Removes a shared label.
     *
     * @param args - Parameters for removing the shared label.
     * @returns A promise that resolves to `true` if successful.
     */
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

    /**
     * Retrieves all comments associated with a task or project.
     *
     * @param args - Parameters for retrieving comments, such as task ID or project ID.
     * @returns A promise that resolves to an array of comments.
     */
    async getComments(
        args: GetTaskCommentsArgs | GetProjectCommentsArgs,
    ): Promise<GetCommentsResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetCommentsResponse>(
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

    /**
     * Retrieves a specific comment by its ID.
     *
     * @param id - The unique identifier of the comment to retrieve.
     * @returns A promise that resolves to the requested comment.
     */
    async getComment(id: string): Promise<Comment> {
        z.string().parse(id)
        const response = await request<Comment>(
            'GET',
            this.syncApiBase,
            generatePath(ENDPOINT_REST_COMMENTS, id),
            this.authToken,
        )

        return validateComment(response.data)
    }

    /**
     * Adds a comment to a task or project.
     *
     * @param args - Parameters for creating the comment, such as content and the target task or project ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created comment.
     */
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

    /**
     * Updates an existing comment by its ID.
     *
     * @param id - The unique identifier of the comment to update.
     * @param args - Update parameters such as new content.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated comment.
     */
    async updateComment(id: string, args: UpdateCommentArgs, requestId?: string): Promise<Comment> {
        z.string().parse(id)
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

    /**
     * Deletes a comment by its ID.
     *
     * @param id - The unique identifier of the comment to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteComment(id: string, requestId?: string): Promise<boolean> {
        z.string().parse(id)
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
