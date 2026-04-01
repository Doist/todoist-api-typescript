import { z } from 'zod'
import {
    getSyncBaseUri,
    ENDPOINT_REST_TASKS,
    ENDPOINT_REST_TASKS_FILTER,
    ENDPOINT_REST_TASKS_COMPLETED_BY_COMPLETION_DATE,
    ENDPOINT_REST_TASKS_COMPLETED_BY_DUE_DATE,
    ENDPOINT_REST_TASKS_COMPLETED_SEARCH,
    ENDPOINT_REST_TASKS_COMPLETED,
    ENDPOINT_REST_TEMPLATES_FILE,
    ENDPOINT_REST_TEMPLATES_URL,
    ENDPOINT_REST_TEMPLATES_CREATE_FROM_FILE,
    ENDPOINT_REST_TEMPLATES_IMPORT_FROM_FILE,
    ENDPOINT_REST_TEMPLATES_IMPORT_FROM_ID,
    ENDPOINT_REST_PROJECTS,
    ENDPOINT_REST_PROJECTS_SEARCH,
    ENDPOINT_SYNC_QUICK_ADD,
    ENDPOINT_REST_TASK_CLOSE,
    ENDPOINT_REST_TASK_REOPEN,
    ENDPOINT_REST_TASK_MOVE,
    ENDPOINT_REST_LABELS,
    ENDPOINT_REST_LABELS_SEARCH,
    ENDPOINT_REST_PROJECT_COLLABORATORS,
    ENDPOINT_REST_SECTIONS,
    ENDPOINT_REST_SECTIONS_SEARCH,
    ENDPOINT_REST_COMMENTS,
    ENDPOINT_REST_LOCATION_REMINDERS,
    ENDPOINT_REST_REMINDERS,
    ENDPOINT_REST_LABELS_SHARED,
    ENDPOINT_REST_LABELS_SHARED_RENAME,
    ENDPOINT_REST_LABELS_SHARED_REMOVE,
    ENDPOINT_SYNC,
    PROJECT_ARCHIVE,
    PROJECT_UNARCHIVE,
    ENDPOINT_REST_PROJECTS_MOVE_TO_WORKSPACE,
    ENDPOINT_REST_PROJECTS_MOVE_TO_PERSONAL,
    ENDPOINT_REST_PROJECTS_ARCHIVED,
    ENDPOINT_REST_PROJECTS_ARCHIVED_COUNT,
    ENDPOINT_REST_PROJECTS_PERMISSIONS,
    ENDPOINT_REST_PROJECT_FULL,
    ENDPOINT_REST_PROJECT_JOIN,
    SECTION_ARCHIVE,
    SECTION_UNARCHIVE,
    ENDPOINT_REST_USER,
    ENDPOINT_REST_PRODUCTIVITY,
    ENDPOINT_REST_ACTIVITIES,
    ENDPOINT_REST_UPLOADS,
    getProjectInsightsActivityStatsEndpoint,
    getProjectInsightsHealthEndpoint,
    getProjectInsightsHealthContextEndpoint,
    getProjectInsightsProgressEndpoint,
    getProjectInsightsHealthAnalyzeEndpoint,
    getWorkspaceInsightsEndpoint,
    ENDPOINT_REST_BACKUPS,
    ENDPOINT_REST_BACKUPS_DOWNLOAD,
    ENDPOINT_REST_EMAILS,
    ENDPOINT_REST_ID_MAPPINGS,
    ENDPOINT_REST_MOVED_IDS,
    ENDPOINT_REST_WORKSPACES,
    ENDPOINT_WORKSPACE_MEMBERS,
    getWorkspaceUserTasksEndpoint,
    getWorkspaceInviteUsersEndpoint,
    getWorkspaceUserEndpoint,
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
    ENDPOINT_REST_FOLDERS,
} from './consts/endpoints'
import { request, isSuccess } from './transport/http-client'
import type { Reminder } from './types'
import { GetActivityLogsArgs, GetActivityLogsResponse } from './types/activity'
import { Backup, GetBackupsArgs, DownloadBackupArgs } from './types/backups'
import {
    Attachment,
    Comment,
    AddCommentArgs,
    UpdateCommentArgs,
    GetProjectCommentsArgs,
    GetTaskCommentsArgs,
    GetCommentsResponse,
} from './types/comments'
import { GetOrCreateEmailArgs, GetOrCreateEmailResponse, DisableEmailArgs } from './types/emails'
import {
    GetFoldersArgs,
    GetFoldersResponse,
    AddFolderArgs,
    UpdateFolderArgs,
} from './types/folders'
import { CustomFetch, CustomFetchResponse } from './types/http'
import { IdMapping, MovedId, GetIdMappingsArgs, GetMovedIdsArgs } from './types/id-mappings'
import {
    ProjectActivityStats,
    ProjectHealth,
    ProjectHealthContext,
    ProjectProgress,
    WorkspaceInsights,
    GetProjectActivityStatsArgs,
    GetWorkspaceInsightsArgs,
} from './types/insights'
import {
    Label,
    AddLabelArgs,
    UpdateLabelArgs,
    GetLabelsArgs,
    SearchLabelsArgs,
    GetLabelsResponse,
    GetSharedLabelsArgs,
    GetSharedLabelsResponse,
    RenameSharedLabelArgs,
    RemoveSharedLabelArgs,
} from './types/labels'
import { ProductivityStats } from './types/productivity'
import {
    PersonalProject,
    WorkspaceProject,
    WorkspaceProjectSchema,
    AddProjectArgs,
    UpdateProjectArgs,
    GetProjectsArgs,
    SearchProjectsArgs,
    GetProjectCollaboratorsArgs,
    GetProjectsResponse,
    GetProjectCollaboratorsResponse,
    GetArchivedProjectsArgs,
    GetArchivedProjectsResponse,
    MoveProjectToWorkspaceArgs,
    MoveProjectToPersonalArgs,
    GetArchivedProjectsCountArgs,
    GetArchivedProjectsCountResponse,
    GetProjectPermissionsResponse,
    GetFullProjectArgs,
    GetFullProjectResponse,
    JoinProjectResponse,
} from './types/projects'
import {
    AddReminderArgs,
    UpdateReminderArgs,
    AddLocationReminderArgs,
    UpdateLocationReminderArgs,
    GetRemindersArgs,
    GetRemindersResponse,
    GetLocationRemindersArgs,
    GetLocationRemindersResponse,
    UpdateReminderArgsSchema,
    UpdateLocationReminderArgsSchema,
    ReminderIdSchema,
} from './types/reminders'
import {
    Section,
    AddSectionArgs,
    UpdateSectionArgs,
    GetSectionsArgs,
    SearchSectionsArgs,
    GetSectionsResponse,
} from './types/sections'
import type { Folder } from './types/sync/resources/folders'
import {
    Task,
    AddTaskArgs,
    GetTasksArgs,
    GetTasksByFilterArgs,
    UpdateTaskArgs,
    QuickAddTaskArgs,
    type MoveTaskArgs,
    GetCompletedTasksByCompletionDateArgs,
    GetCompletedTasksByDueDateArgs,
    GetCompletedTasksResponse,
    SearchCompletedTasksArgs,
    GetTasksResponse,
    GetAllCompletedTasksArgs,
    GetAllCompletedTasksResponse,
} from './types/tasks'
import {
    ExportTemplateFileArgs,
    ExportTemplateUrlArgs,
    ExportTemplateUrlResponse,
    CreateProjectFromTemplateArgs,
    CreateProjectFromTemplateResponse,
    ImportTemplateIntoProjectArgs,
    ImportTemplateFromIdArgs,
    ImportTemplateResponse,
} from './types/templates'
import { UploadFileArgs, DeleteUploadArgs } from './types/uploads'
import { CurrentUser } from './types/users'
import {
    WorkspaceUser,
    WorkspaceInvitation,
    WorkspacePlanDetails,
    JoinWorkspaceResult,
    Workspace,
    AddWorkspaceArgs,
    UpdateWorkspaceArgs,
    GetWorkspaceMembersActivityArgs,
    GetWorkspaceMembersActivityResponse,
    GetWorkspaceUserTasksArgs,
    GetWorkspaceUserTasksResponse,
    InviteWorkspaceUsersArgs,
    InviteWorkspaceUsersResponse,
    UpdateWorkspaceUserArgs,
    RemoveWorkspaceUserArgs,
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
} from './types/workspaces'
import {
    normalizeObjectEventTypeForApi,
    denormalizeObjectTypeFromApi,
} from './utils/activity-helpers'
import { camelCaseKeys } from './utils/case-conversion'
import { uploadMultipartFile } from './utils/multipart-upload'
import { processTaskContent } from './utils/uncompletable-helpers'
import { formatDateToYYYYMMDD } from './utils/url-helpers'
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
    validateReminder,
    validateReminderArray,
    validateLocationReminderArray,
    validateActivityEventArray,
    validateWorkspaceUserArray,
    validateWorkspaceInvitation,
    validateWorkspaceInvitationArray,
    validateWorkspacePlanDetails,
    validateJoinWorkspaceResult,
    validateWorkspace,
    validateWorkspaceArray,
    validateMemberActivityInfoArray,
    validateWorkspaceUserTaskArray,
    validateProjectActivityStats,
    validateProjectHealth,
    validateProjectHealthContext,
    validateProjectProgress,
    validateWorkspaceInsights,
    validateBackupArray,
    validateIdMappingArray,
    validateMovedIdArray,
    validateFolder,
    validateFolderArray,
    validateCollaboratorArray,
    validateCollaboratorStateArray,
    validateNoteArray,
} from './utils/validators'

import { v4 as uuidv4 } from 'uuid'
import { TodoistArgumentError, TodoistRequestError } from './types'
import {
    type SyncResponse,
    type SyncCommand,
    type SyncRequest,
    DATE_FORMAT_TO_API,
    TIME_FORMAT_TO_API,
    DAY_OF_WEEK_TO_API,
    type UserUpdateArgs,
    type TaskUpdateDateCompleteArgs,
    type UpdateGoalsArgs,
} from './types/sync'

const MAX_COMMAND_COUNT = 100

/**
 * Joins path segments using `/` separator.
 * @param segments A list of **valid** path segments.
 * @returns A joined path.
 */
function generatePath(...segments: string[]): string {
    return segments.join('/')
}

function spreadIfDefined<T, V extends Record<string, unknown>>(
    value: T | undefined,
    fn: (v: T) => V,
): V | Record<string, never> {
    return value !== undefined ? fn(value) : {}
}

function serializeUserUpdateArgs(args: UserUpdateArgs): Record<string, unknown> {
    return {
        ...args,
        ...spreadIfDefined(args.dateFormat, (v) => ({ dateFormat: DATE_FORMAT_TO_API[v] })),
        ...spreadIfDefined(args.timeFormat, (v) => ({ timeFormat: TIME_FORMAT_TO_API[v] })),
        ...spreadIfDefined(args.startDay, (v) => ({ startDay: DAY_OF_WEEK_TO_API[v] })),
        ...spreadIfDefined(args.nextWeek, (v) => ({ nextWeek: DAY_OF_WEEK_TO_API[v] })),
    }
}

function serializeTaskUpdateDateCompleteArgs(
    args: TaskUpdateDateCompleteArgs,
): Record<string, unknown> {
    return {
        ...args,
        isForward: args.isForward ? 1 : 0,
        ...spreadIfDefined(args.resetSubtasks, (v) => ({ resetSubtasks: v ? 1 : 0 })),
    }
}

function serializeUpdateGoalsArgs(args: UpdateGoalsArgs): Record<string, unknown> {
    return {
        ...args,
        ...spreadIfDefined(args.vacationMode, (v) => ({ vacationMode: v ? 1 : 0 })),
        ...spreadIfDefined(args.karmaDisabled, (v) => ({ karmaDisabled: v ? 1 : 0 })),
    }
}

function preprocessSyncCommands(commands: SyncCommand[]): SyncCommand[] {
    return commands.map((cmd): SyncCommand => {
        if (cmd.type === 'user_update')
            return { ...cmd, args: serializeUserUpdateArgs(cmd.args as UserUpdateArgs) }
        if (cmd.type === 'item_update_date_complete')
            return {
                ...cmd,
                args: serializeTaskUpdateDateCompleteArgs(cmd.args as TaskUpdateDateCompleteArgs),
            }
        if (cmd.type === 'update_goals')
            return { ...cmd, args: serializeUpdateGoalsArgs(cmd.args as UpdateGoalsArgs) }
        return cmd
    })
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

function headersToRecord(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
        result[key] = value
    })
    return result
}

/**
 * Response from viewAttachment, extending CustomFetchResponse with
 * arrayBuffer() support for binary file content.
 */
export type FileResponse = CustomFetchResponse & {
    arrayBuffer(): Promise<ArrayBuffer>
}

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

    constructor(
        /**
         * Your Todoist API token.
         */
        authToken: string,
        /**
         * Optional configuration options
         */
        options?: TodoistApiOptions,
    ) {
        if (typeof options === 'string') {
            throw new TypeError(
                'Passing baseUrl as a string is no longer supported. Use an options object instead: new TodoistApi(token, { baseUrl })',
            )
        }
        this.authToken = authToken
        const opts = options || {}
        this.syncApiBase = getSyncBaseUri(opts.baseUrl)
        this.customFetch = opts.customFetch
    }

    /**
     * Makes a request to the Sync API and handles error checking.
     *
     * @param syncRequest - The sync request payload
     * @param requestId - Optional request identifier
     * @param hasSyncCommands - Whether this request contains sync commands (write operations)
     * @returns The sync response data
     * @throws TodoistRequestError if sync status contains errors
     */
    private async requestSync(
        syncRequest: SyncRequest,
        requestId?: string,
        hasSyncCommands = false,
    ): Promise<SyncResponse> {
        const processedRequest = syncRequest.commands?.length
            ? { ...syncRequest, commands: preprocessSyncCommands(syncRequest.commands) }
            : syncRequest
        const response = await request<SyncResponse>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_SYNC,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: processedRequest,
            requestId: requestId,
            hasSyncCommands: hasSyncCommands,
        })

        // Check for sync errors and throw if any are found
        if (response.data.syncStatus) {
            Object.entries(response.data.syncStatus).forEach(([_, value]) => {
                if (value === 'ok') return

                throw new TodoistRequestError(value.error, value.httpCode, value.errorExtra)
            })
        }

        return response.data
    }

    /**
     * Executes a raw Sync API request.
     *
     * This method provides direct access to the Sync API, allowing you to send
     * strongly-typed commands and request specific resource types.
     *
     * @param request - The sync request payload containing commands and/or resource types.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the sync response.
     * @throws TodoistRequestError if the sync status contains errors.
     *
     * @example
     * ```typescript
     * import { createCommand } from '@doist/todoist-sdk'
     *
     * const response = await api.sync({
     *     commands: [
     *         createCommand('item_add', { content: 'Buy milk' }),
     *     ],
     *     resourceTypes: ['items'],
     *     syncToken: '*',
     * })
     * ```
     */
    async sync(syncRequest: SyncRequest, requestId?: string): Promise<SyncResponse> {
        return this.requestSync(syncRequest, requestId, Boolean(syncRequest.commands?.length))
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
     * Retrieves all completed tasks with optional filters.
     *
     * Uses offset-based pagination rather than cursor-based.
     *
     * @param args - Optional parameters including project ID, label, date range, and pagination.
     * @returns A promise that resolves to completed tasks with associated project and section data.
     */
    async getAllCompletedTasks(
        args: GetAllCompletedTasksArgs = {},
    ): Promise<GetAllCompletedTasksResponse> {
        const { since, until, ...rest } = args
        const { data } = await request<Record<string, unknown>>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_TASKS_COMPLETED,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: {
                ...rest,
                ...(since ? { since: since.toISOString() } : {}),
                ...(until ? { until: until.toISOString() } : {}),
            },
        })
        return {
            projects: data.projects as Record<string, Record<string, unknown>>,
            sections: data.sections as Record<string, Record<string, unknown>>,
            items: validateTaskArray(data.items as unknown[]),
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
     * @param args - Update parameters such as content, priority, or due date. Pass
     * `dueString: null` (or `"no date"`) to clear the due date.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated task.
     */
    async updateTask(id: string, args: UpdateTaskArgs, requestId?: string): Promise<Task> {
        z.string().parse(id)

        // Translate SDK alias for due-date clearing to Todoist's accepted payload value.
        const normalizedArgs = args.dueString === null ? { ...args, dueString: 'no date' } : args

        // Process content if both content and isUncompletable are provided
        const processedArgs =
            normalizedArgs.content && normalizedArgs.isUncompletable !== undefined
                ? {
                      ...normalizedArgs,
                      content: processTaskContent(
                          normalizedArgs.content,
                          normalizedArgs.isUncompletable,
                      ),
                  }
                : normalizedArgs

        // Remap `order` → `childOrder` so snakeCaseKeys() produces `child_order`
        const { order, ...argsWithoutOrder } = processedArgs
        const remappedArgs =
            order !== undefined ? { ...argsWithoutOrder, childOrder: order } : argsWithoutOrder

        const response = await request<Task>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_TASKS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: remappedArgs,
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
     */
    async moveTasks(ids: string[], args: MoveTaskArgs, requestId?: string): Promise<Task[]> {
        if (ids.length > MAX_COMMAND_COUNT) {
            throw new TodoistRequestError(`Maximum number of items is ${MAX_COMMAND_COUNT}`, 400)
        }
        const commands: SyncCommand[] = ids.map((id) => ({
            type: 'item_move',
            uuid: uuidv4(),
            args: {
                id,
                ...spreadIfDefined(args.projectId, (v) => ({ projectId: v })),
                ...spreadIfDefined(args.sectionId, (v) => ({ sectionId: v })),
                ...spreadIfDefined(args.parentId, (v) => ({ parentId: v })),
            },
        }))

        const syncRequest: SyncRequest = {
            commands,
            resourceTypes: ['items'],
        }

        const syncResponse = await this.requestSync(syncRequest, requestId, true)

        if (!syncResponse.items?.length) {
            throw new TodoistRequestError('Tasks not found', 404)
        }

        const syncTasks = syncResponse.items.filter((task) => ids.includes(task.id))
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
                ...spreadIfDefined(args.projectId, (v) => ({ project_id: v })),
                ...spreadIfDefined(args.sectionId, (v) => ({ section_id: v })),
                ...spreadIfDefined(args.parentId, (v) => ({ parent_id: v })),
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
     * Moves a project to a workspace.
     *
     * @param args - The arguments for moving the project.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the moved project.
     */
    async moveProjectToWorkspace(
        args: MoveProjectToWorkspaceArgs,
        requestId?: string,
    ): Promise<PersonalProject | WorkspaceProject> {
        const response = await request<{ project: PersonalProject | WorkspaceProject }>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_PROJECTS_MOVE_TO_WORKSPACE,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
        return validateProject(response.data.project)
    }

    /**
     * Moves a project to personal.
     *
     * @param args - The arguments for moving the project.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the moved project.
     */
    async moveProjectToPersonal(
        args: MoveProjectToPersonalArgs,
        requestId?: string,
    ): Promise<PersonalProject | WorkspaceProject> {
        const response = await request<{ project: PersonalProject | WorkspaceProject }>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_PROJECTS_MOVE_TO_PERSONAL,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
        return validateProject(response.data.project)
    }

    /**
     * Counts the number of archived projects.
     *
     * @param args - Optional parameters to filter the count.
     * @returns A promise that resolves to the count of archived projects.
     */
    async getArchivedProjectsCount(
        args: GetArchivedProjectsCountArgs = {},
    ): Promise<GetArchivedProjectsCountResponse> {
        const { data } = await request<GetArchivedProjectsCountResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_PROJECTS_ARCHIVED_COUNT,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })
        return data
    }

    /**
     * Retrieves the role-to-action permission mappings for projects.
     *
     * @returns A promise that resolves to the permission mappings.
     */
    async getProjectPermissions(): Promise<GetProjectPermissionsResponse> {
        const { data } = await request<GetProjectPermissionsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_PROJECTS_PERMISSIONS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })
        return data
    }

    /**
     * Retrieves full project data including tasks, sections, collaborators, and notes.
     *
     * @param id - The unique identifier of the project.
     * @param args - Optional parameters.
     * @returns A promise that resolves to the full project data.
     */
    async getFullProject(
        id: string,
        args: GetFullProjectArgs = {},
    ): Promise<GetFullProjectResponse> {
        z.string().parse(id)
        const { data } = await request<Record<string, unknown>>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_PROJECTS, id, ENDPOINT_REST_PROJECT_FULL),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })
        return {
            project: data.project ? validateProject(data.project) : null,
            commentsCount: data.commentsCount as number,
            tasks: validateTaskArray(data.tasks as unknown[]),
            sections: validateSectionArray(data.sections as unknown[]),
            collaborators: validateUserArray(data.collaborators as unknown[]),
            notes: validateCommentArray(data.notes as unknown[]),
        }
    }

    /**
     * Joins a workspace project.
     *
     * Only used for workspaces — this endpoint is used to join a workspace project
     * by a workspace user.
     *
     * @param id - The unique identifier of the workspace project to join.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the full project data after joining.
     */
    async joinProject(id: string, requestId?: string): Promise<JoinProjectResponse> {
        z.string().parse(id)
        const { data } = await request<JoinProjectResponse>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_PROJECTS, id, ENDPOINT_REST_PROJECT_JOIN),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return {
            project: WorkspaceProjectSchema.parse(data.project),
            tasks: validateTaskArray(data.tasks),
            sections: validateSectionArray(data.sections),
            comments: validateNoteArray(data.comments),
            collaborators: validateCollaboratorArray(data.collaborators),
            collaboratorStates: validateCollaboratorStateArray(data.collaboratorStates),
            folder: data.folder ? validateFolder(data.folder) : null,
            subprojects: data.subprojects.map((p) => WorkspaceProjectSchema.parse(p)),
        }
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

    // ── Insights ──

    /**
     * Retrieves activity statistics for a project.
     *
     * @param projectId - The unique identifier of the project.
     * @param args - Optional parameters including weeks and weekly counts flag.
     * @returns A promise that resolves to the project activity stats.
     */
    async getProjectActivityStats(
        projectId: string,
        args: GetProjectActivityStatsArgs = {},
    ): Promise<ProjectActivityStats> {
        z.string().parse(projectId)
        const response = await request<ProjectActivityStats>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: getProjectInsightsActivityStatsEndpoint(projectId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: { objectType: 'ITEM', eventType: 'COMPLETED', ...args },
        })
        return validateProjectActivityStats(response.data)
    }

    /**
     * Retrieves the health status of a project.
     *
     * @param projectId - The unique identifier of the project.
     * @returns A promise that resolves to the project health data.
     */
    async getProjectHealth(projectId: string): Promise<ProjectHealth> {
        z.string().parse(projectId)
        const response = await request<ProjectHealth>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: getProjectInsightsHealthEndpoint(projectId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })
        return validateProjectHealth(response.data)
    }

    /**
     * Retrieves the health context for a project, including metrics and task details.
     *
     * @param projectId - The unique identifier of the project.
     * @returns A promise that resolves to the project health context.
     */
    async getProjectHealthContext(projectId: string): Promise<ProjectHealthContext> {
        z.string().parse(projectId)
        const response = await request<ProjectHealthContext>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: getProjectInsightsHealthContextEndpoint(projectId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })
        return validateProjectHealthContext(response.data)
    }

    /**
     * Retrieves progress information for a project.
     *
     * @param projectId - The unique identifier of the project.
     * @returns A promise that resolves to the project progress data.
     */
    async getProjectProgress(projectId: string): Promise<ProjectProgress> {
        z.string().parse(projectId)
        const response = await request<ProjectProgress>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: getProjectInsightsProgressEndpoint(projectId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })
        return validateProjectProgress(response.data)
    }

    /**
     * Retrieves insights for all projects in a workspace.
     *
     * @param workspaceId - The unique identifier of the workspace.
     * @param args - Optional parameters including project IDs filter.
     * @returns A promise that resolves to workspace insights data.
     */
    async getWorkspaceInsights(
        workspaceId: string,
        args: GetWorkspaceInsightsArgs = {},
    ): Promise<WorkspaceInsights> {
        z.string().parse(workspaceId)
        const response = await request<WorkspaceInsights>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: getWorkspaceInsightsEndpoint(workspaceId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: {
                ...args,
                ...(args.projectIds ? { projectIds: args.projectIds.join(',') } : {}),
            },
        })
        return validateWorkspaceInsights(response.data)
    }

    /**
     * Triggers a health analysis for a project.
     *
     * @param projectId - The unique identifier of the project.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated project health data.
     */
    async analyzeProjectHealth(projectId: string, requestId?: string): Promise<ProjectHealth> {
        z.string().parse(projectId)
        const response = await request<ProjectHealth>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: getProjectInsightsHealthAnalyzeEndpoint(projectId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return validateProjectHealth(response.data)
    }

    // ── Sections ──

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
     * Archives a section by its ID.
     *
     * @param id - The unique identifier of the section to archive.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated section.
     */
    async archiveSection(id: string, requestId?: string): Promise<Section> {
        z.string().parse(id)
        const response = await request<Section>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_SECTIONS, id, SECTION_ARCHIVE),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return validateSection(response.data)
    }

    /**
     * Unarchives a section by its ID.
     *
     * @param id - The unique identifier of the section to unarchive.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated section.
     */
    async unarchiveSection(id: string, requestId?: string): Promise<Section> {
        z.string().parse(id)
        const response = await request<Section>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_SECTIONS, id, SECTION_UNARCHIVE),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return validateSection(response.data)
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
            data: { results, nextCursor },
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
     * Searches labels by name.
     *
     * @param args - Search parameters including the query string.
     * @returns A promise that resolves to a paginated response of labels.
     */
    async searchLabels(args: SearchLabelsArgs): Promise<GetLabelsResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetLabelsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_LABELS_SEARCH,
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
            data: { results, nextCursor },
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
        const { uidsToNotify, ...rest } = args
        const response = await request<Comment>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_COMMENTS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: {
                ...rest,
                ...(uidsToNotify ? { uidsToNotify: uidsToNotify.join(',') } : {}),
            },
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
     * Retrieves a paginated list of time-based reminders.
     *
     * @param args - Optional parameters including task ID filter and pagination.
     * @returns A promise that resolves to a paginated list of reminders.
     */
    async getReminders(args: GetRemindersArgs = {}): Promise<GetRemindersResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetRemindersResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_REMINDERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })
        return {
            results: validateReminderArray(results),
            nextCursor,
        }
    }

    /**
     * Retrieves a paginated list of location-based reminders.
     *
     * @param args - Optional parameters including task ID filter and pagination.
     * @returns A promise that resolves to a paginated list of location reminders.
     */
    async getLocationReminders(
        args: GetLocationRemindersArgs = {},
    ): Promise<GetLocationRemindersResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetLocationRemindersResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_LOCATION_REMINDERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })
        return {
            results: validateLocationReminderArray(results),
            nextCursor,
        }
    }

    /**
     * Retrieves a time-based reminder by its ID.
     *
     * @param id - The unique identifier of the reminder to retrieve.
     * @returns A promise that resolves to the requested reminder.
     */
    async getReminder(id: string): Promise<Reminder> {
        ReminderIdSchema.parse(id)
        try {
            const response = await request<Reminder>({
                httpMethod: 'GET',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
            })

            return validateReminder(response.data)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Reminder ${id} was not found on the time-based reminder endpoint. If this is a location reminder, use getLocationReminder instead.`,
            )
        }
    }

    /**
     * Retrieves a location reminder by its ID.
     *
     * @param id - The unique identifier of the location reminder to retrieve.
     * @returns A promise that resolves to the requested reminder.
     */
    async getLocationReminder(id: string): Promise<Reminder> {
        ReminderIdSchema.parse(id)
        try {
            const response = await request<Reminder>({
                httpMethod: 'GET',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_LOCATION_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
            })

            return validateReminder(response.data)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Location reminder ${id} was not found on the location reminder endpoint. If this is a time-based reminder, use getReminder instead.`,
            )
        }
    }

    /**
     * Creates a time-based reminder for a task.
     *
     * @param args - Reminder creation parameters for relative or absolute reminders.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created reminder.
     */
    async addReminder(args: AddReminderArgs, requestId?: string): Promise<Reminder> {
        const response = await request<Reminder>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_REMINDERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })

        return validateReminder(response.data)
    }

    /**
     * Creates a location reminder for a task.
     *
     * @param args - Location reminder creation parameters.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created reminder.
     */
    async addLocationReminder(
        args: AddLocationReminderArgs,
        requestId?: string,
    ): Promise<Reminder> {
        const response = await request<Reminder>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_LOCATION_REMINDERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: {
                ...args,
                reminderType: 'location',
            },
            requestId: requestId,
        })

        return validateReminder(response.data)
    }

    /**
     * Updates an existing time-based reminder.
     *
     * @param id - The unique identifier of the reminder to update.
     * @param args - Reminder update parameters.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated reminder.
     */
    async updateReminder(
        id: string,
        args: UpdateReminderArgs,
        requestId?: string,
    ): Promise<Reminder> {
        ReminderIdSchema.parse(id)
        const payload = UpdateReminderArgsSchema.parse(args)
        try {
            const response = await request<Reminder>({
                httpMethod: 'POST',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
                payload,
                requestId: requestId,
            })

            return validateReminder(response.data)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Reminder ${id} was not found on the time-based reminder endpoint. If this is a location reminder, use updateLocationReminder instead.`,
            )
        }
    }

    /**
     * Updates an existing location reminder.
     *
     * @param id - The unique identifier of the location reminder to update.
     * @param args - Location reminder update parameters.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated reminder.
     */
    async updateLocationReminder(
        id: string,
        args: UpdateLocationReminderArgs,
        requestId?: string,
    ): Promise<Reminder> {
        ReminderIdSchema.parse(id)
        const payload = UpdateLocationReminderArgsSchema.parse(args)
        try {
            const response = await request<Reminder>({
                httpMethod: 'POST',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_LOCATION_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
                payload,
                requestId: requestId,
            })

            return validateReminder(response.data)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Location reminder ${id} was not found on the location reminder endpoint. If this is a time-based reminder, use updateReminder instead.`,
            )
        }
    }

    /**
     * Deletes a time-based reminder by its ID.
     *
     * @param id - The unique identifier of the reminder to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteReminder(id: string, requestId?: string): Promise<boolean> {
        ReminderIdSchema.parse(id)
        try {
            const response = await request({
                httpMethod: 'DELETE',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
                requestId: requestId,
            })
            return isSuccess(response)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Reminder ${id} was not found on the time-based reminder endpoint. If this is a location reminder, use deleteLocationReminder instead.`,
            )
        }
    }

    /**
     * Deletes a location reminder by its ID.
     *
     * @param id - The unique identifier of the location reminder to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteLocationReminder(id: string, requestId?: string): Promise<boolean> {
        ReminderIdSchema.parse(id)
        try {
            const response = await request({
                httpMethod: 'DELETE',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_LOCATION_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
                requestId: requestId,
            })
            return isSuccess(response)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Location reminder ${id} was not found on the location reminder endpoint. If this is a time-based reminder, use deleteReminder instead.`,
            )
        }
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
        // Convert Date objects to YYYY-MM-DD strings
        const dateFrom =
            args.dateFrom instanceof Date ? formatDateToYYYYMMDD(args.dateFrom) : args.dateFrom
        const dateTo = args.dateTo instanceof Date ? formatDateToYYYYMMDD(args.dateTo) : args.dateTo

        // Destructure out raw date, filter-type, and removed legacy fields so they don't leak into payload
        const {
            dateFrom: _dateFrom,
            dateTo: _dateTo,
            objectEventTypes,
            objectType: _objectType,
            eventType: _eventType,
            since: _since,
            until: _until,
            ...rest
        } = args as GetActivityLogsArgs & Record<string, unknown>

        // Build normalized objectEventTypes for the API
        let normalizedObjectEventTypes: string[] | undefined
        if (objectEventTypes !== undefined) {
            const arr = Array.isArray(objectEventTypes) ? objectEventTypes : [objectEventTypes]
            normalizedObjectEventTypes = arr.map(normalizeObjectEventTypeForApi)
        }

        const processedArgs = {
            ...rest,
            ...(dateFrom !== undefined ? { dateFrom } : {}),
            ...(dateTo !== undefined ? { dateTo } : {}),
            ...(normalizedObjectEventTypes !== undefined
                ? { objectEventTypes: normalizedObjectEventTypes }
                : {}),
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

    /**
     * Fetches the content of a file attachment from a Todoist comment.
     *
     * Accepts either a Comment object (extracts the file URL from its attachment)
     * or a direct file URL string. Returns the raw Response object so the caller
     * can read the body in the appropriate format (.arrayBuffer(), .text(), etc.).
     *
     * @param commentOrUrl - A Comment object with a file attachment, or a file URL string.
     * @returns The raw fetch Response for the file content.
     * @throws Error if a Comment is provided without a file attachment or file URL.
     *
     * @example
     * ```typescript
     * // From a comment object
     * const comments = await api.getComments({ taskId: '12345' })
     * const comment = comments.results[0]
     * const response = await api.viewAttachment(comment)
     * const imageData = await response.arrayBuffer()
     *
     * // From a URL string
     * const response = await api.viewAttachment('https://files.todoist.com/...')
     * const text = await response.text()
     * ```
     */
    async viewAttachment(commentOrUrl: Comment | string): Promise<FileResponse> {
        let fileUrl: string

        if (typeof commentOrUrl === 'string') {
            fileUrl = commentOrUrl
        } else {
            if (!commentOrUrl.fileAttachment?.fileUrl) {
                throw new Error('Comment does not have a file attachment')
            }
            fileUrl = commentOrUrl.fileAttachment.fileUrl
        }

        // Validate the URL belongs to Todoist to prevent leaking the auth token
        const urlHostname = new URL(fileUrl).hostname
        if (!urlHostname.endsWith('.todoist.com')) {
            throw new Error('Attachment URLs must be on a todoist.com domain')
        }

        const fetchOptions: RequestInit = {
            method: 'GET',
            headers: { Authorization: `Bearer ${this.authToken}` },
        }

        if (this.customFetch) {
            const response = await this.customFetch(fileUrl, fetchOptions)

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch attachment: ${response.status} ${response.statusText}`,
                )
            }

            // Convert text to ArrayBuffer for custom fetch implementations that lack arrayBuffer()
            const text = await response.text()
            const buffer = new TextEncoder().encode(text).buffer

            return {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                text: () => Promise.resolve(text),
                json: () => response.json(),
                arrayBuffer: () => Promise.resolve(buffer),
            }
        }

        const response = await fetch(fileUrl, fetchOptions)

        if (!response.ok) {
            throw new Error(`Failed to fetch attachment: ${response.status} ${response.statusText}`)
        }

        return {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: headersToRecord(response.headers),
            text: () => response.text(),
            json: () => response.json(),
            arrayBuffer: () => response.arrayBuffer(),
        }
    }

    // ── Folders ──

    /**
     * Retrieves a paginated list of folders.
     *
     * @param args - Filter parameters such as workspace ID.
     * @returns A promise that resolves to a paginated response of folders.
     */
    async getFolders(args: GetFoldersArgs): Promise<GetFoldersResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetFoldersResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_FOLDERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })

        return {
            results: validateFolderArray(results),
            nextCursor,
        }
    }

    /**
     * Retrieves a single folder by its ID.
     *
     * @param id - The unique identifier of the folder.
     * @returns A promise that resolves to the requested folder.
     */
    async getFolder(id: string): Promise<Folder> {
        z.string().parse(id)
        const response = await request<Folder>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_FOLDERS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })

        return validateFolder(response.data)
    }

    /**
     * Creates a new folder.
     *
     * @param args - Folder creation parameters including name and workspace ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created folder.
     */
    async addFolder(args: AddFolderArgs, requestId?: string): Promise<Folder> {
        const response = await request<Folder>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_FOLDERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })

        return validateFolder(response.data)
    }

    /**
     * Updates an existing folder by its ID.
     *
     * @param id - The unique identifier of the folder to update.
     * @param args - Update parameters such as name or default order.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated folder.
     */
    async updateFolder(id: string, args: UpdateFolderArgs, requestId?: string): Promise<Folder> {
        z.string().parse(id)
        const response = await request<Folder>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_FOLDERS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })

        return validateFolder(response.data)
    }

    /**
     * Deletes a folder by its ID.
     *
     * @param id - The unique identifier of the folder to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteFolder(id: string, requestId?: string): Promise<boolean> {
        z.string().parse(id)
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_FOLDERS, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return isSuccess(response)
    }

    // ── Backups ──

    /**
     * Retrieves a list of available backups.
     *
     * @param args - Optional parameters including MFA token.
     * @returns A promise that resolves to an array of backups.
     */
    async getBackups(args: GetBackupsArgs = {}): Promise<Backup[]> {
        const response = await request<unknown[]>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_BACKUPS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })
        return validateBackupArray(response.data)
    }

    /**
     * Downloads a backup file as binary data.
     *
     * @param args - Arguments including the backup file URL (from getBackups).
     * @returns A promise that resolves to a response with binary data accessible via arrayBuffer().
     */
    async downloadBackup(args: DownloadBackupArgs): Promise<FileResponse> {
        const url = `${this.syncApiBase}${ENDPOINT_REST_BACKUPS_DOWNLOAD}?file=${encodeURIComponent(args.file)}`
        const fetchOptions = {
            headers: { Authorization: `Bearer ${this.authToken}` },
        }

        if (this.customFetch) {
            const response = await this.customFetch(url, fetchOptions)
            if (!response.ok) {
                throw new Error(
                    `Failed to download backup: ${response.status} ${response.statusText}`,
                )
            }
            const text = await response.text()
            const buffer = new TextEncoder().encode(text).buffer
            return {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                text: () => Promise.resolve(text),
                json: () => response.json(),
                arrayBuffer: () => Promise.resolve(buffer),
            }
        }

        const response = await fetch(url, fetchOptions)
        if (!response.ok) {
            throw new Error(`Failed to download backup: ${response.status} ${response.statusText}`)
        }
        return {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: headersToRecord(response.headers),
            text: () => response.text(),
            json: () => response.json(),
            arrayBuffer: () => response.arrayBuffer(),
        }
    }

    // ── Emails ──

    /**
     * Gets or creates an email forwarding address for an object.
     *
     * @param args - Arguments including object type and ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the email address.
     */
    async getOrCreateEmailForwarding(
        args: GetOrCreateEmailArgs,
        requestId?: string,
    ): Promise<GetOrCreateEmailResponse> {
        const { data } = await request<GetOrCreateEmailResponse>({
            httpMethod: 'PUT',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_EMAILS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
        return data
    }

    /**
     * Disables email forwarding for an object.
     *
     * @param args - Arguments including object type and ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async disableEmailForwarding(args: DisableEmailArgs, requestId?: string): Promise<boolean> {
        const queryParams = new URLSearchParams({
            obj_type: args.objType,
            obj_id: args.objId,
        })
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: `${ENDPOINT_REST_EMAILS}?${queryParams.toString()}`,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return isSuccess(response)
    }

    // ── ID Mappings ──

    /**
     * Retrieves ID mappings between old and new IDs.
     *
     * @param args - Arguments including object type and IDs to look up.
     * @returns A promise that resolves to an array of ID mappings.
     */
    async getIdMappings(args: GetIdMappingsArgs): Promise<IdMapping[]> {
        const response = await request<unknown[]>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(
                ENDPOINT_REST_ID_MAPPINGS,
                args.objName,
                args.objIds.join(','),
            ),
            apiToken: this.authToken,
            customFetch: this.customFetch,
        })
        return validateIdMappingArray(response.data)
    }

    /**
     * Retrieves moved IDs for objects that have been migrated.
     *
     * @param args - Arguments including object type and optional old IDs to look up.
     * @returns A promise that resolves to an array of moved ID pairs.
     */
    async getMovedIds(args: GetMovedIdsArgs): Promise<MovedId[]> {
        const response = await request<unknown[]>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_MOVED_IDS, args.objName),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args.oldIds ? { oldIds: args.oldIds.join(',') } : undefined,
        })
        return validateMovedIdArray(response.data)
    }

    // ── Templates ──

    /**
     * Exports a project as a template file (CSV format).
     *
     * @param args - Arguments including project ID and optional date format preference.
     * @returns A promise that resolves to the template file content as a string.
     */
    async exportTemplateAsFile(args: ExportTemplateFileArgs): Promise<string> {
        const response = await request<string>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_TEMPLATES_FILE,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })
        return response.data
    }

    /**
     * Exports a project as a template URL.
     *
     * @param args - Arguments including project ID and optional date format preference.
     * @returns A promise that resolves to the file name and URL.
     */
    async exportTemplateAsUrl(args: ExportTemplateUrlArgs): Promise<ExportTemplateUrlResponse> {
        const { data } = await request<ExportTemplateUrlResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_TEMPLATES_URL,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })
        return data
    }

    /**
     * Creates a new project from a template file.
     *
     * @param args - Arguments including project name, template file, and optional workspace ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created project data.
     */
    async createProjectFromTemplate(
        args: CreateProjectFromTemplateArgs,
        requestId?: string,
    ): Promise<CreateProjectFromTemplateResponse> {
        const { file, fileName, name, workspaceId } = args
        const additionalFields: Record<string, string> = { name }
        if (workspaceId !== undefined && workspaceId !== null) {
            additionalFields.workspace_id = workspaceId
        }

        const data = await uploadMultipartFile<Record<string, unknown>>({
            baseUrl: this.syncApiBase,
            authToken: this.authToken,
            endpoint: ENDPOINT_REST_TEMPLATES_CREATE_FROM_FILE,
            file,
            fileName,
            additionalFields,
            customFetch: this.customFetch,
            requestId,
        })
        return this.validateTemplateResponse(
            camelCaseKeys(data),
        ) as CreateProjectFromTemplateResponse
    }

    /**
     * Imports a template file into an existing project.
     *
     * @param args - Arguments including project ID and template file.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the import result.
     */
    async importTemplateIntoProject(
        args: ImportTemplateIntoProjectArgs,
        requestId?: string,
    ): Promise<ImportTemplateResponse> {
        const { file, fileName, projectId } = args
        const data = await uploadMultipartFile<Record<string, unknown>>({
            baseUrl: this.syncApiBase,
            authToken: this.authToken,
            endpoint: ENDPOINT_REST_TEMPLATES_IMPORT_FROM_FILE,
            file,
            fileName,
            additionalFields: { project_id: projectId },
            customFetch: this.customFetch,
            requestId,
        })
        return this.validateTemplateResponse(camelCaseKeys(data)) as ImportTemplateResponse
    }

    /**
     * Imports a template by ID into an existing project.
     *
     * @param args - Arguments including project ID, template ID, and optional locale.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the import result.
     */
    async importTemplateFromId(
        args: ImportTemplateFromIdArgs,
        requestId?: string,
    ): Promise<ImportTemplateResponse> {
        const { data } = await request<Record<string, unknown>>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_TEMPLATES_IMPORT_FROM_ID,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
        return this.validateTemplateResponse(data) as ImportTemplateResponse
    }

    private validateTemplateResponse(data: Record<string, unknown>) {
        return {
            ...data,
            projects: validateProjectArray((data.projects as unknown[]) ?? []),
            sections: validateSectionArray((data.sections as unknown[]) ?? []),
            tasks: validateTaskArray((data.tasks as unknown[]) ?? []),
            comments: validateCommentArray((data.comments as unknown[]) ?? []),
        }
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
     * Retrieves all workspaces for the authenticated user.
     *
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to an array of workspaces.
     *
     * @example
     * ```typescript
     * const workspaces = await api.getWorkspaces()
     * workspaces.forEach(workspace => {
     *   console.log(`${workspace.name} (${workspace.plan}) - Role: ${workspace.role}`)
     * })
     * ```
     */
    async getWorkspaces(requestId?: string): Promise<Workspace[]> {
        const response = await request<unknown[]>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_WORKSPACES,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return validateWorkspaceArray(response.data)
    }

    /**
     * Retrieves a workspace by its ID.
     *
     * @param id - The unique identifier of the workspace.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the requested workspace.
     */
    async getWorkspace(id: string, requestId?: string): Promise<Workspace> {
        z.string().parse(id)
        const response = await request<Workspace>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_WORKSPACES, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return validateWorkspace(response.data)
    }

    /**
     * Creates a new workspace.
     *
     * @param args - The arguments for creating the workspace.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created workspace.
     */
    async addWorkspace(args: AddWorkspaceArgs, requestId?: string): Promise<Workspace> {
        const response = await request<Workspace>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_WORKSPACES,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
        return validateWorkspace(response.data)
    }

    /**
     * Updates an existing workspace.
     *
     * @param id - The unique identifier of the workspace to update.
     * @param args - The arguments for updating the workspace.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated workspace.
     */
    async updateWorkspace(
        id: string,
        args: UpdateWorkspaceArgs,
        requestId?: string,
    ): Promise<Workspace> {
        z.string().parse(id)
        const response = await request<Workspace>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_WORKSPACES, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })
        return validateWorkspace(response.data)
    }

    /**
     * Deletes a workspace by its ID.
     *
     * @param id - The unique identifier of the workspace to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteWorkspace(id: string, requestId?: string): Promise<boolean> {
        z.string().parse(id)
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: generatePath(ENDPOINT_REST_WORKSPACES, id),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return isSuccess(response)
    }

    /**
     * Retrieves activity information for workspace members.
     *
     * @param args - Arguments including workspace ID and optional user/project filters.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to workspace members activity data.
     */
    async getWorkspaceMembersActivity(
        args: GetWorkspaceMembersActivityArgs,
        requestId?: string,
    ): Promise<GetWorkspaceMembersActivityResponse> {
        const { workspaceId, ...queryParams } = args
        const { data } = await request<{ members: unknown[] }>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_WORKSPACE_MEMBERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: { workspaceId, ...queryParams },
            requestId: requestId,
        })
        return {
            members: validateMemberActivityInfoArray(data.members),
        }
    }

    /**
     * Retrieves tasks assigned to a specific user in a workspace.
     *
     * @param args - Arguments including workspace ID, user ID, and optional project filter.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to workspace user tasks.
     */
    async getWorkspaceUserTasks(
        args: GetWorkspaceUserTasksArgs,
        requestId?: string,
    ): Promise<GetWorkspaceUserTasksResponse> {
        const { workspaceId, userId, ...queryParams } = args
        const { data } = await request<{ tasks: unknown[] }>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: getWorkspaceUserTasksEndpoint(workspaceId, userId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: queryParams,
            requestId: requestId,
        })
        return {
            tasks: validateWorkspaceUserTaskArray(data.tasks),
        }
    }

    /**
     * Invites users to a workspace by email.
     *
     * @param args - Arguments including workspace ID, email list, and optional role.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the list of invited emails.
     */
    async inviteWorkspaceUsers(
        args: InviteWorkspaceUsersArgs,
        requestId?: string,
    ): Promise<InviteWorkspaceUsersResponse> {
        const { workspaceId, ...payload } = args
        const { data } = await request<InviteWorkspaceUsersResponse>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: getWorkspaceInviteUsersEndpoint(workspaceId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: payload,
            requestId: requestId,
        })
        return data
    }

    /**
     * Updates a workspace user's role.
     *
     * @param args - Arguments including workspace ID, user ID, and new role.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated workspace user view.
     */
    async updateWorkspaceUser(
        args: UpdateWorkspaceUserArgs,
        requestId?: string,
    ): Promise<JoinWorkspaceResult> {
        const { workspaceId, userId, ...payload } = args
        const response = await request<JoinWorkspaceResult>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: getWorkspaceUserEndpoint(workspaceId, userId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: payload,
            requestId: requestId,
        })
        return validateJoinWorkspaceResult(response.data)
    }

    /**
     * Removes a user from a workspace.
     *
     * @param args - Arguments including workspace ID and user ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async removeWorkspaceUser(args: RemoveWorkspaceUserArgs, requestId?: string): Promise<boolean> {
        const { workspaceId, userId } = args
        const response = await request({
            httpMethod: 'DELETE',
            baseUri: this.syncApiBase,
            relativePath: getWorkspaceUserEndpoint(workspaceId, userId),
            apiToken: this.authToken,
            customFetch: this.customFetch,
            requestId: requestId,
        })
        return isSuccess(response)
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

        // oxlint-disable-next-line no-unsafe-assignment, no-unsafe-call, no-unsafe-member-access
        const validatedProjects = response.data.results?.map((project: unknown) =>
            validateProject(project),
        )

        return {
            // oxlint-disable-next-line no-unsafe-assignment
            ...response.data,
            // oxlint-disable-next-line no-unsafe-assignment
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

        // oxlint-disable-next-line no-unsafe-assignment, no-unsafe-call, no-unsafe-member-access
        const validatedProjects = response.data.results?.map((project: unknown) =>
            validateProject(project),
        )

        return {
            // oxlint-disable-next-line no-unsafe-assignment
            ...response.data,
            // oxlint-disable-next-line no-unsafe-assignment
            results: validatedProjects || [],
        } as GetProjectsResponse
    }
}
