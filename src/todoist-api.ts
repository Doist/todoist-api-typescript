import {
    Attachment,
    PersonalProject,
    WorkspaceProject,
    Label,
    Section,
    Comment,
    Task,
    CurrentUser,
    ProductivityStats,
    WorkspaceUser,
    WorkspaceInvitation,
    WorkspacePlanDetails,
    JoinWorkspaceResult,
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
    SearchProjectsArgs,
    GetProjectCollaboratorsArgs,
    GetLabelsArgs,
    GetLabelsResponse,
    GetTasksResponse,
    GetProjectsResponse,
    GetProjectCollaboratorsResponse,
    GetSectionsArgs,
    SearchSectionsArgs,
    GetSectionsResponse,
    GetSharedLabelsResponse,
    GetCommentsResponse,
    type MoveTaskArgs,
    GetCompletedTasksByCompletionDateArgs,
    GetCompletedTasksByDueDateArgs,
    GetCompletedTasksResponse,
    GetArchivedProjectsArgs,
    GetArchivedProjectsResponse,
    SearchCompletedTasksArgs,
    GetActivityLogsArgs,
    GetActivityLogsResponse,
    UploadFileArgs,
    DeleteUploadArgs,
    GetWorkspaceInvitationsArgs,
    DeleteWorkspaceInvitationArgs,
    WorkspaceInvitationActionArgs,
    JoinWorkspaceArgs,
    WorkspaceLogoArgs,
    GetWorkspacePlanDetailsArgs,
    GetWorkspaceUsersArgs,
    GetWorkspaceUsersResponse,
    GetWorkspaceProjectsArgs,
    WorkspaceInvitationsResponse,
    AllWorkspaceInvitationsResponse,
    WorkspaceLogoResponse,
} from './types/requests'
import { CustomFetch } from './types/http'
import { request, isSuccess } from './rest-client'
import {
    getSyncBaseUri,
    ENDPOINT_REST_TASKS,
    ENDPOINT_REST_TASKS_FILTER,
    ENDPOINT_REST_TASKS_COMPLETED_BY_COMPLETION_DATE,
    ENDPOINT_REST_TASKS_COMPLETED_BY_DUE_DATE,
    ENDPOINT_REST_TASKS_COMPLETED_SEARCH,
    ENDPOINT_REST_PROJECTS,
    ENDPOINT_REST_PROJECTS_SEARCH,
    ENDPOINT_SYNC_QUICK_ADD,
    ENDPOINT_REST_TASK_CLOSE,
    ENDPOINT_REST_TASK_REOPEN,
    ENDPOINT_REST_TASK_MOVE,
    ENDPOINT_REST_LABELS,
    ENDPOINT_REST_PROJECT_COLLABORATORS,
    ENDPOINT_REST_SECTIONS,
    ENDPOINT_REST_SECTIONS_SEARCH,
    ENDPOINT_REST_COMMENTS,
    ENDPOINT_REST_LABELS_SHARED,
    ENDPOINT_REST_LABELS_SHARED_RENAME,
    ENDPOINT_REST_LABELS_SHARED_REMOVE,
    ENDPOINT_SYNC,
    PROJECT_ARCHIVE,
    PROJECT_UNARCHIVE,
    ENDPOINT_REST_PROJECTS_ARCHIVED,
    ENDPOINT_REST_USER,
    ENDPOINT_REST_PRODUCTIVITY,
    ENDPOINT_REST_ACTIVITIES,
    ENDPOINT_REST_UPLOADS,
    ENDPOINT_WORKSPACE_INVITATIONS,
    ENDPOINT_WORKSPACE_INVITATIONS_ALL,
    ENDPOINT_WORKSPACE_INVITATIONS_DELETE,
    getWorkspaceInvitationAcceptEndpoint,
    getWorkspaceInvitationRejectEndpoint,
    ENDPOINT_WORKSPACE_JOIN,
    ENDPOINT_WORKSPACE_LOGO,
    ENDPOINT_WORKSPACE_PLAN_DETAILS,
    ENDPOINT_WORKSPACE_USERS,
    getWorkspaceActiveProjectsEndpoint,
    getWorkspaceArchivedProjectsEndpoint,
} from './consts/endpoints'
import {
    validateAttachment,
    validateComment,
    validateCommentArray,
    validateCurrentUser,
    validateLabel,
    validateLabelArray,
    validateProject,
    validateProjectArray,
    validateSection,
    validateSectionArray,
    validateTask,
    validateTaskArray,
    validateUserArray,
    validateProductivityStats,
    validateActivityEventArray,
    validateWorkspaceUserArray,
    validateWorkspaceInvitation,
    validateWorkspaceInvitationArray,
    validateWorkspacePlanDetails,
    validateJoinWorkspaceResult,
} from './utils/validators'
import { formatDateToYYYYMMDD } from './utils/url-helpers'
import { uploadMultipartFile } from './utils/multipart-upload'
import { normalizeObjectTypeForApi, denormalizeObjectTypeFromApi } from './utils/activity-helpers'
import { processTaskContent } from './utils/uncompletable-helpers'
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

/**
 * Configuration options for the TodoistApi constructor
 */
export type TodoistApiOptions = {
    /**
     * Optional custom API base URL. If not provided, defaults to Todoist's standard API endpoint
     */
    baseUrl?: string
    /**
     * Optional custom fetch function for alternative HTTP clients (e.g., Obsidian's requestUrl, React Native fetch)
     */
    customFetch?: CustomFetch
}

export class TodoistApi {
    private authToken: string
    private syncApiBase: string
    private customFetch?: CustomFetch

    // Constructor overloads for backward compatibility
    /**
     * @deprecated Use options object instead: new TodoistApi(token, { baseUrl, customFetch })
     */
    constructor(authToken: string, baseUrl: string)
    constructor(authToken: string)
    constructor(authToken: string, options?: TodoistApiOptions)
    constructor(
        /**
         * Your Todoist API token.
         */
        authToken: string,
        /**
         * Optional custom API base URL or options object
         */
        baseUrlOrOptions?: string | TodoistApiOptions,
    ) {
        this.authToken = authToken

        // Handle backward compatibility
        if (typeof baseUrlOrOptions === 'string') {
            // Legacy constructor: (authToken, baseUrl)
            // eslint-disable-next-line no-console
            console.warn(
                'TodoistApi constructor with baseUrl as second parameter is deprecated. Use options object instead: new TodoistApi(token, { baseUrl, customFetch })',
            )
            this.syncApiBase = getSyncBaseUri(baseUrlOrOptions)
            this.customFetch = undefined
        } else {
            // New constructor: (authToken, options)
            const options: TodoistApiOptions = (baseUrlOrOptions as TodoistApiOptions) || {}
            this.syncApiBase = getSyncBaseUri(options.baseUrl)
            this.customFetch = options.customFetch
        }
    }

    /**
     * Retrieves information about the authenticated user.
     *
     * @returns A promise that resolves to the current user's information.
     */
    async getUser(): Promise<CurrentUser> {
        const response = await request<CurrentUser>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_USER,
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })

        return validateCurrentUser(response.data)
    }

    /**
     * Retrieves a single active (non-completed) task by its ID.
     *
     * @param id - The unique identifier of the task.
     * @returns A promise that resolves to the requested task.
     */
    async getTask(id: string): Promise<Task> {
        z.string().parse(id)
        const response = await request<Task>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_TASKS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })

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
        } = await request<GetTasksResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_TASKS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

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
        } = await request<GetTasksResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_TASKS_FILTER,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

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
        } = await request<GetCompletedTasksResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_TASKS_COMPLETED_BY_COMPLETION_DATE,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

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
        } = await request<GetCompletedTasksResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_TASKS_COMPLETED_BY_DUE_DATE,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

        return {
            items: validateTaskArray(items),
            nextCursor,
        }
    }

    /**
     * Searches completed tasks by query string.
     *
     * @param args - Parameters for searching, including the query string.
     * @returns A promise that resolves to a paginated response of completed tasks.
     */
    async searchCompletedTasks(args: SearchCompletedTasksArgs): Promise<GetCompletedTasksResponse> {
        const {
            data: { items, nextCursor },
        } = await request<GetCompletedTasksResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_TASKS_COMPLETED_SEARCH,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

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
        // Process content based on isUncompletable flag
        const processedArgs = {
            ...args,
            content: processTaskContent(args.content, args.isUncompletable),
        }

        const response = await request<Task>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_TASKS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: processedArgs,
            requestId: requestId,
        })

        return validateTask(response.data)
    }

    /**
     * Quickly adds a task using natural language processing for due dates.
     *
     * @param args - Quick add task parameters, including content and due date.
     * @returns A promise that resolves to the created task.
     */
    async quickAddTask(args: QuickAddTaskArgs): Promise<Task> {
        // Process text based on isUncompletable flag
        const processedArgs = {
            ...args,
            text: processTaskContent(args.text, args.isUncompletable),
        }

        const response = await request<Task>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_SYNC_QUICK_ADD,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: processedArgs,
        })

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

        // Process content if both content and isUncompletable are provided
        const processedArgs =
            args.content && args.isUncompletable !== undefined
                ? { ...args, content: processTaskContent(args.content, args.isUncompletable) }
                : args

        const response = await request<Task>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_TASKS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: processedArgs,
            requestId: requestId,
        })

        return validateTask(response.data)
    }

    /**
     * Moves existing tasks by their ID to either a different parent/section/project.
     *
     * @param ids - The unique identifier of the tasks to be moved.
     * @param args - The paramets that should contain only one of projectId, sectionId, or parentId
     * @param requestId - Optional custom identifier for the request.
     * @returns - A promise that resolves to an array of the updated tasks.
     * @deprecated Use `moveTask` for single task operations. This method uses the Sync API and may be removed in a future version.
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

        const response = await request<SyncResponse>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_SYNC,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: syncRequest,
            requestId: requestId,
            hasSyncCommands: true,
        })

        if (response.data.syncStatus) {
            Object.entries(response.data.syncStatus).forEach(([_, value]) => {
                if (value === 'ok') return

                throw new TodoistRequestError(value.error, value.httpCode, value.errorExtra)
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
     * Moves a task by its ID to either a different parent/section/project.
     *
     * @param id - The unique identifier of the task to be moved.
     * @param args - The parameters that should contain exactly one of projectId, sectionId, or parentId
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated task.
     */
    async moveTask(id: string, args: MoveTaskArgs, requestId?: string): Promise<Task> {
        z.string().parse(id)
        const response = await request<Task>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_TASKS, id, ENDPOINT_REST_TASK_MOVE),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: {
                ...(args.projectId && { project_id: args.projectId }),
                ...(args.sectionId && { section_id: args.sectionId }),
                ...(args.parentId && { parent_id: args.parentId }),
            },
            requestId: requestId,
        })

        return validateTask(response.data)
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
        const response = await request({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_TASKS, id, ENDPOINT_REST_TASK_CLOSE),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
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
        const response = await request({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_TASKS, id, ENDPOINT_REST_TASK_REOPEN),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
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
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_TASKS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
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
        const response = await request<PersonalProject | WorkspaceProject>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_PROJECTS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })

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
        } = await request<GetProjectsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_PROJECTS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

        return {
            results: validateProjectArray(results),
            nextCursor,
        }
    }

    /**
     * Searches projects by name.
     *
     * @param args - Search parameters including the query string.
     * @returns A promise that resolves to a paginated response of projects.
     */
    async searchProjects(args: SearchProjectsArgs): Promise<GetProjectsResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetProjectsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_PROJECTS_SEARCH,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

        return {
            results: validateProjectArray(results),
            nextCursor,
        }
    }

    /**
     * Retrieves all archived projects with optional filters.
     *
     * @param args - Optional filters for retrieving archived projects.
     * @returns A promise that resolves to an array of archived projects.
     */
    async getArchivedProjects(
        args: GetArchivedProjectsArgs = {},
    ): Promise<GetArchivedProjectsResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetArchivedProjectsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_PROJECTS_ARCHIVED,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

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
        const response = await request<PersonalProject | WorkspaceProject>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_PROJECTS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })

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
        const response = await request<PersonalProject | WorkspaceProject>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_PROJECTS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })

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
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_PROJECTS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
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
        const response = await request<PersonalProject | WorkspaceProject>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_PROJECTS, id, PROJECT_ARCHIVE),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
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
        const response = await request<PersonalProject | WorkspaceProject>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_PROJECTS, id, PROJECT_UNARCHIVE),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
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
        } = await request<GetProjectCollaboratorsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(
                ENDPOINT_REST_PROJECTS,
                projectId,
                ENDPOINT_REST_PROJECT_COLLABORATORS,
            ),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

        return {
            results: validateUserArray(results),
            nextCursor,
        }
    }

    /**
     * Retrieves all sections within a specific project or matching criteria.
     *
     * @param args - Filter parameters such as project ID. If no projectId is provided,
     * all sections are returned.
     * @returns A promise that resolves to an array of sections.
     */
    async getSections(args?: GetSectionsArgs): Promise<GetSectionsResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetSectionsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_SECTIONS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

        return {
            results: validateSectionArray(results),
            nextCursor,
        }
    }

    /**
     * Searches sections by name.
     *
     * @param args - Search parameters including the query string.
     * @returns A promise that resolves to a paginated response of sections.
     */
    async searchSections(args: SearchSectionsArgs): Promise<GetSectionsResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetSectionsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_SECTIONS_SEARCH,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

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
        const response = await request<Section>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_SECTIONS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })

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
        const response = await request<Section>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_SECTIONS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })

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
        const response = await request({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_SECTIONS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
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
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_SECTIONS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
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
        const response = await request<Label>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_LABELS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })

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
        } = await request<GetLabelsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_LABELS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

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
        const response = await request<Label>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_LABELS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })

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
        const response = await request({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_LABELS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
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
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_LABELS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
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
        } = await request<GetSharedLabelsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_LABELS_SHARED,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

        return { results, nextCursor }
    }

    /**
     * Renames an existing shared label.
     *
     * @param args - Parameters for renaming the shared label, including the current and new name.
     * @returns A promise that resolves to `true` if successful.
     */
    async renameSharedLabel(args: RenameSharedLabelArgs): Promise<boolean> {
        const response = await request<void>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_LABELS_SHARED_RENAME,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

        return isSuccess(response)
    }

    /**
     * Removes a shared label.
     *
     * @param args - Parameters for removing the shared label.
     * @returns A promise that resolves to `true` if successful.
     */
    async removeSharedLabel(args: RemoveSharedLabelArgs): Promise<boolean> {
        const response = await request<void>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_LABELS_SHARED_REMOVE,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

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
        } = await request<GetCommentsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_COMMENTS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

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
        const response = await request<Comment>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_COMMENTS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })

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
        const response = await request<Comment>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_COMMENTS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })

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
        const response = await request<boolean>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_COMMENTS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
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
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_COMMENTS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return isSuccess(response)
    }
    /**
     * Retrieves productivity stats for the authenticated user.
     *
     * @returns A promise that resolves to the productivity stats.
     */
    async getProductivityStats(): Promise<ProductivityStats> {
        const response = await request<ProductivityStats>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_PRODUCTIVITY,
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })
        return validateProductivityStats(response.data)
    }

    /**
     * Retrieves activity logs with optional filters.
     *
     * @param args - Optional filter parameters for activity logs.
     * @returns A promise that resolves to a paginated response of activity events.
     */
    async getActivityLogs(args: GetActivityLogsArgs = {}): Promise<GetActivityLogsResponse> {
        // Convert Date objects to YYYY-MM-DD strings and modern object types to legacy API types
        const processedArgs = {
            ...args,
            ...(args.since instanceof Date && { since: formatDateToYYYYMMDD(args.since) }),
            ...(args.until instanceof Date && { until: formatDateToYYYYMMDD(args.until) }),
            ...(args.objectType && { objectType: normalizeObjectTypeForApi(args.objectType) }),
        }

        const {
            data: { results, nextCursor },
        } = await request<GetActivityLogsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_ACTIVITIES,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: processedArgs as Record<string, unknown>,
        })

        // Convert legacy API object types back to modern SDK types
        const normalizedResults = results.map((event) => {
            const normalizedType = denormalizeObjectTypeFromApi(event.objectType)
            return {
                ...event,
                objectType: normalizedType || event.objectType,
            }
        }) as unknown[]

        return {
            results: validateActivityEventArray(normalizedResults),
            nextCursor,
        }
    }

    /**
     * Uploads a file and returns attachment metadata.
     * This creates an upload record that can be referenced in tasks or comments.
     *
     * @param args - Upload parameters including file content, filename, and optional project ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the uploaded file's attachment metadata.
     *
     * @example
     * ```typescript
     * // Upload from a file path
     * const upload = await api.uploadFile({
     *   file: '/path/to/document.pdf',
     *   projectId: '12345'
     * })
     *
     * // Upload from a Buffer
     * const buffer = fs.readFileSync('/path/to/document.pdf')
     * const upload = await api.uploadFile({
     *   file: buffer,
     *   fileName: 'document.pdf',  // Required for Buffer/Stream
     *   projectId: '12345'
     * })
     *
     * // Use the returned fileUrl in a comment
     * await api.addComment({
     *   content: 'See attached document',
     *   taskId: '67890',
     *   attachment: {
     *     fileUrl: upload.fileUrl,
     *     fileName: upload.fileName,
     *     fileType: upload.fileType,
     *     resourceType: upload.resourceType
     *   }
     * })
     * ```
     */
    async uploadFile(args: UploadFileArgs, requestId?: string): Promise<Attachment> {
        const additionalFields: Record<string, string | number | boolean> = {}
        if (args.projectId) {
            additionalFields.project_id = args.projectId
        }

        const data = await uploadMultipartFile<Attachment>({
            baseUrl: this.syncApiBase,
            authToken: this.authToken,
            endpoint: ENDPOINT_REST_UPLOADS,
            file: args.file,
            fileName: args.fileName,
            additionalFields: additionalFields,
            requestId: requestId,
            customFetch: this.customFetch,
        })

        return validateAttachment(data)
    }

    /**
     * Deletes an uploaded file by its URL.
     *
     * @param args - The file URL to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if deletion was successful.
     *
     * @example
     * ```typescript
     * await api.deleteUpload({
     *   fileUrl: 'https://cdn.todoist.com/...'
     * })
     * ```
     */
    async deleteUpload(args: DeleteUploadArgs, requestId?: string): Promise<boolean> {
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_UPLOADS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
        return isSuccess(response)
    }

    /* Workspace methods */

    /**
     * Gets pending invitations for a workspace.
     *
     * @param args - Arguments including workspace ID.
     * @param requestId - Optional request ID for idempotency.
     * @returns Array of email addresses with pending invitations.
     */
    async getWorkspaceInvitations(
        args: GetWorkspaceInvitationsArgs,
        requestId?: string,
    ): Promise<WorkspaceInvitationsResponse> {
        const response = await request<WorkspaceInvitationsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_WORKSPACE_INVITATIONS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: { workspace_id: args.workspaceId },
            requestId: requestId,
        })

        return response.data
    }

    /**
     * Gets all workspace invitations (admin only).
     *
     * @param requestId - Optional request ID for idempotency.
     * @returns Array of email addresses with pending invitations.
     */
    async getAllWorkspaceInvitations(
        args: { workspaceId?: number } = {},
        requestId?: string,
    ): Promise<AllWorkspaceInvitationsResponse> {
        const queryParams: Record<string, string | number> = {}
        if (args.workspaceId) {
            queryParams.workspace_id = args.workspaceId
        }

        const response = await request<AllWorkspaceInvitationsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_WORKSPACE_INVITATIONS_ALL,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: queryParams,
            requestId: requestId,
        })

        return validateWorkspaceInvitationArray(response.data)
    }

    /**
     * Deletes a workspace invitation (admin only).
     *
     * @param args - Arguments including workspace ID and user email.
     * @param requestId - Optional request ID for idempotency.
     * @returns The deleted invitation.
     */
    async deleteWorkspaceInvitation(
        args: DeleteWorkspaceInvitationArgs,
        requestId?: string,
    ): Promise<WorkspaceInvitation> {
        const response = await request<WorkspaceInvitation>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_WORKSPACE_INVITATIONS_DELETE,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: {
                workspace_id: args.workspaceId,
                user_email: args.userEmail,
            },
            requestId: requestId,
        })

        return validateWorkspaceInvitation(response.data)
    }

    /**
     * Accepts a workspace invitation.
     *
     * @param args - Arguments including invite code.
     * @param requestId - Optional request ID for idempotency.
     * @returns The accepted invitation.
     */
    async acceptWorkspaceInvitation(
        args: WorkspaceInvitationActionArgs,
        requestId?: string,
    ): Promise<WorkspaceInvitation> {
        const response = await request<WorkspaceInvitation>({
            httpMethod: 'PUT',
            baseUri: this.syncApiBase,
            relativePath: getWorkspaceInvitationAcceptEndpoint(args.inviteCode),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })

        return validateWorkspaceInvitation(response.data)
    }

    /**
     * Rejects a workspace invitation.
     *
     * @param args - Arguments including invite code.
     * @param requestId - Optional request ID for idempotency.
     * @returns The rejected invitation.
     */
    async rejectWorkspaceInvitation(
        args: WorkspaceInvitationActionArgs,
        requestId?: string,
    ): Promise<WorkspaceInvitation> {
        const response = await request<WorkspaceInvitation>({
            httpMethod: 'PUT',
            baseUri: this.syncApiBase,
            relativePath: getWorkspaceInvitationRejectEndpoint(args.inviteCode),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })

        return validateWorkspaceInvitation(response.data)
    }

    /**
     * Joins a workspace via invitation link or domain auto-join.
     *
     * @param args - Arguments including invite code or workspace ID.
     * @param requestId - Optional request ID for idempotency.
     * @returns Workspace user information.
     */
    async joinWorkspace(args: JoinWorkspaceArgs, requestId?: string): Promise<JoinWorkspaceResult> {
        const response = await request<JoinWorkspaceResult>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_WORKSPACE_JOIN,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: {
                invite_code: args.inviteCode,
                workspace_id: args.workspaceId,
            },
            requestId: requestId,
        })

        return validateJoinWorkspaceResult(response.data)
    }

    /**
     * Uploads or updates a workspace logo.
     *
     * @param args - Arguments including workspace ID, file, and options.
     * @param requestId - Optional request ID for idempotency.
     * @returns Logo information or null if deleted.
     */
    async uploadWorkspaceLogo(
        args: WorkspaceLogoArgs,
        requestId?: string,
    ): Promise<WorkspaceLogoResponse> {
        if (args.delete) {
            // Delete logo
            const data = await uploadMultipartFile<WorkspaceLogoResponse>({
                baseUrl: this.syncApiBase,
                authToken: this.authToken,
                endpoint: ENDPOINT_WORKSPACE_LOGO,
                file: Buffer.alloc(0), // Empty buffer for delete
                fileName: 'delete',
                additionalFields: {
                    workspace_id: args.workspaceId,
                    delete: true,
                },
                requestId: requestId,
                customFetch: this.customFetch,
            })
            return data
        }

        if (!args.file) {
            throw new Error('file is required when not deleting logo')
        }

        // Validate buffer is not empty if it's a Buffer
        if (Buffer.isBuffer(args.file) && args.file.length === 0) {
            throw new Error('Cannot upload empty image file')
        }

        const additionalFields: Record<string, string | number | boolean> = {
            workspace_id: args.workspaceId,
        }

        const data = await uploadMultipartFile<WorkspaceLogoResponse>({
            baseUrl: this.syncApiBase,
            authToken: this.authToken,
            endpoint: ENDPOINT_WORKSPACE_LOGO,
            file: args.file,
            fileName: args.fileName,
            additionalFields: additionalFields,
            requestId: requestId,
            customFetch: this.customFetch,
        })

        return data
    }

    /**
     * Gets workspace plan and billing details.
     *
     * @param args - Arguments including workspace ID.
     * @param requestId - Optional request ID for idempotency.
     * @returns Workspace plan details.
     */
    async getWorkspacePlanDetails(
        args: GetWorkspacePlanDetailsArgs,
        requestId?: string,
    ): Promise<WorkspacePlanDetails> {
        const response = await request<WorkspacePlanDetails>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_WORKSPACE_PLAN_DETAILS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: { workspace_id: args.workspaceId },
            requestId: requestId,
        })

        return validateWorkspacePlanDetails(response.data)
    }

    /**
     * Gets workspace users with pagination.
     *
     * @param args - Arguments including optional workspace ID, cursor, and limit.
     * @param requestId - Optional request ID for idempotency.
     * @returns Paginated list of workspace users.
     */
    async getWorkspaceUsers(
        args: GetWorkspaceUsersArgs = {},
        requestId?: string,
    ): Promise<GetWorkspaceUsersResponse> {
        const queryParams: Record<string, string | number> = {}
        if (args.workspaceId !== undefined && args.workspaceId !== null) {
            queryParams.workspace_id = args.workspaceId
        }
        if (args.cursor) {
            queryParams.cursor = args.cursor
        }
        if (args.limit) {
            queryParams.limit = args.limit
        }

        const response = await request<{
            hasMore: boolean
            nextCursor?: string
            workspaceUsers: WorkspaceUser[]
        }>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_WORKSPACE_USERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: queryParams,
            requestId: requestId,
        })

        return {
            hasMore: response.data.hasMore || false,
            nextCursor: response.data.nextCursor,
            workspaceUsers: validateWorkspaceUserArray(response.data.workspaceUsers || []),
        }
    }

    /**
     * Gets active projects in a workspace with pagination.
     *
     * @param args - Arguments including workspace ID, cursor, and limit.
     * @param requestId - Optional request ID for idempotency.
     * @returns Paginated list of active workspace projects.
     */
    async getWorkspaceActiveProjects(
        args: GetWorkspaceProjectsArgs,
        requestId?: string,
    ): Promise<GetProjectsResponse> {
        const queryParams: Record<string, string | number> = {}
        if (args.cursor) {
            queryParams.cursor = args.cursor
        }
        if (args.limit) {
            queryParams.limit = args.limit
        }

        const response = await request<GetProjectsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: getWorkspaceActiveProjectsEndpoint(args.workspaceId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: queryParams,
            requestId: requestId,
        })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const validatedProjects = response.data.results?.map((project: unknown) =>
            validateProject(project),
        )

        return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...response.data,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            results: validatedProjects || [],
        } as GetProjectsResponse
    }

    /**
     * Gets archived projects in a workspace with pagination.
     *
     * @param args - Arguments including workspace ID, cursor, and limit.
     * @param requestId - Optional request ID for idempotency.
     * @returns Paginated list of archived workspace projects.
     */
    async getWorkspaceArchivedProjects(
        args: GetWorkspaceProjectsArgs,
        requestId?: string,
    ): Promise<GetProjectsResponse> {
        const queryParams: Record<string, string | number> = {}
        if (args.cursor) {
            queryParams.cursor = args.cursor
        }
        if (args.limit) {
            queryParams.limit = args.limit
        }

        const response = await request<GetProjectsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: getWorkspaceArchivedProjectsEndpoint(args.workspaceId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: queryParams,
            requestId: requestId,
        })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const validatedProjects = response.data.results?.map((project: unknown) =>
            validateProject(project),
        )

        return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...response.data,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            results: validatedProjects || [],
        } as GetProjectsResponse
    }
}
