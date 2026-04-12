import { z } from 'zod'
import { CommentClient } from './clients/comment-client'
import { FolderClient } from './clients/folder-client'
import { InsightsClient } from './clients/insights-client'
import { LabelClient } from './clients/label-client'
import { ProjectClient } from './clients/project-client'
import { ReminderClient } from './clients/reminder-client'
import { SectionClient } from './clients/section-client'
import { TaskClient } from './clients/task-client'
import {
    getSyncBaseUri,
    ENDPOINT_REST_TEMPLATES_FILE,
    ENDPOINT_REST_TEMPLATES_URL,
    ENDPOINT_REST_TEMPLATES_CREATE_FROM_FILE,
    ENDPOINT_REST_TEMPLATES_IMPORT_FROM_FILE,
    ENDPOINT_REST_TEMPLATES_IMPORT_FROM_ID,
    ENDPOINT_REST_USER,
    ENDPOINT_REST_PRODUCTIVITY,
    ENDPOINT_REST_ACTIVITIES,
    ENDPOINT_REST_UPLOADS,
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
} from './consts/endpoints'
import { request, isSuccess } from './transport/http-client'
import { performSyncRequest } from './transport/sync-request'
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
import { generatePath } from './utils/request-helpers'
import { formatDateToYYYYMMDD } from './utils/url-helpers'
import {
    validateAttachment,
    validateCommentArray,
    validateCurrentUser,
    validateProject,
    validateProjectArray,
    validateSectionArray,
    validateTaskArray,
    validateProductivityStats,
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
    validateBackupArray,
    validateIdMappingArray,
    validateMovedIdArray,
} from './utils/validators'

import { type SyncResponse, type SyncRequest } from './types/sync'

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

    // Internal domain sub-clients. See src/clients/* — each groups a set of
    // related endpoints. The public methods on TodoistApi below delegate
    // through these; sub-clients themselves are not exposed from the package.
    private readonly taskClient: TaskClient
    private readonly projectClient: ProjectClient
    private readonly sectionClient: SectionClient
    private readonly labelClient: LabelClient
    private readonly commentClient: CommentClient
    private readonly reminderClient: ReminderClient
    private readonly insightsClient: InsightsClient
    private readonly folderClient: FolderClient

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

        const clientDeps = {
            authToken: this.authToken,
            syncApiBase: this.syncApiBase,
            customFetch: this.customFetch,
        }
        this.taskClient = new TaskClient(clientDeps)
        this.projectClient = new ProjectClient(clientDeps)
        this.sectionClient = new SectionClient(clientDeps)
        this.labelClient = new LabelClient(clientDeps)
        this.commentClient = new CommentClient(clientDeps)
        this.reminderClient = new ReminderClient(clientDeps)
        this.insightsClient = new InsightsClient(clientDeps)
        this.folderClient = new FolderClient(clientDeps)
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
        return performSyncRequest(
            {
                authToken: this.authToken,
                syncApiBase: this.syncApiBase,
                customFetch: this.customFetch,
            },
            syncRequest,
            { requestId, hasSyncCommands: Boolean(syncRequest.commands?.length) },
        )
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
        return this.taskClient.getTask(id)
    }

    /**
     * Retrieves a list of active tasks filtered by specific parameters.
     *
     * @param args - Filter parameters such as project ID, label ID, or due date.
     * @returns A promise that resolves to an array of tasks.
     */
    async getTasks(args: GetTasksArgs = {}): Promise<GetTasksResponse> {
        return this.taskClient.getTasks(args)
    }

    /**
     * Retrieves tasks filtered by a filter string.
     *
     * @param args - Parameters for filtering tasks, including the query string and optional language.
     * @returns A promise that resolves to a paginated response of tasks.
     */
    async getTasksByFilter(args: GetTasksByFilterArgs): Promise<GetTasksResponse> {
        return this.taskClient.getTasksByFilter(args)
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
        return this.taskClient.getCompletedTasksByCompletionDate(args)
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
        return this.taskClient.getCompletedTasksByDueDate(args)
    }

    /**
     * Searches completed tasks by query string.
     *
     * @param args - Parameters for searching, including the query string.
     * @returns A promise that resolves to a paginated response of completed tasks.
     */
    async searchCompletedTasks(args: SearchCompletedTasksArgs): Promise<GetCompletedTasksResponse> {
        return this.taskClient.searchCompletedTasks(args)
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
        return this.taskClient.getAllCompletedTasks(args)
    }

    /**
     * Creates a new task with the provided parameters.
     *
     * @param args - Task creation parameters such as content, due date, or priority.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created task.
     */
    async addTask(args: AddTaskArgs, requestId?: string): Promise<Task> {
        return this.taskClient.addTask(args, requestId)
    }

    /**
     * Quickly adds a task using natural language processing for due dates.
     *
     * @param args - Quick add task parameters, including content and due date.
     * @returns A promise that resolves to the created task.
     */
    async quickAddTask(args: QuickAddTaskArgs): Promise<Task> {
        return this.taskClient.quickAddTask(args)
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
        return this.taskClient.updateTask(id, args, requestId)
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
        return this.taskClient.moveTasks(ids, args, requestId)
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
        return this.taskClient.moveTask(id, args, requestId)
    }

    /**
     * Closes (completes) a task by its ID.
     *
     * @param id - The unique identifier of the task to close.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async closeTask(id: string, requestId?: string): Promise<boolean> {
        return this.taskClient.closeTask(id, requestId)
    }

    /**
     * Reopens a previously closed (completed) task by its ID.
     *
     * @param id - The unique identifier of the task to reopen.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async reopenTask(id: string, requestId?: string): Promise<boolean> {
        return this.taskClient.reopenTask(id, requestId)
    }

    /**
     * Deletes a task by its ID.
     *
     * @param id - The unique identifier of the task to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteTask(id: string, requestId?: string): Promise<boolean> {
        return this.taskClient.deleteTask(id, requestId)
    }

    /**
     * Retrieves a project by its ID.
     *
     * @param id - The unique identifier of the project.
     * @returns A promise that resolves to the requested project.
     */
    async getProject(id: string): Promise<PersonalProject | WorkspaceProject> {
        return this.projectClient.getProject(id)
    }

    /**
     * Retrieves all projects with optional filters.
     *
     * @param args - Optional filters for retrieving projects.
     * @returns A promise that resolves to an array of projects.
     */
    async getProjects(args: GetProjectsArgs = {}): Promise<GetProjectsResponse> {
        return this.projectClient.getProjects(args)
    }

    /**
     * Searches projects by name.
     *
     * @param args - Search parameters including the query string.
     * @returns A promise that resolves to a paginated response of projects.
     */
    async searchProjects(args: SearchProjectsArgs): Promise<GetProjectsResponse> {
        return this.projectClient.searchProjects(args)
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
        return this.projectClient.getArchivedProjects(args)
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
        return this.projectClient.addProject(args, requestId)
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
        return this.projectClient.updateProject(id, args, requestId)
    }

    /**
     * Deletes a project by its ID.
     *
     * If the project is a workspace project, it must have been
     * archived first before it can be deleted, otherwise calling
     * this function will result in an error. Personal projects can
     * be deleted regardless of their archived status.
     *
     * @param id - The unique identifier of the project to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteProject(id: string, requestId?: string): Promise<boolean> {
        return this.projectClient.deleteProject(id, requestId)
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
        return this.projectClient.archiveProject(id, requestId)
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
        return this.projectClient.unarchiveProject(id, requestId)
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
        return this.projectClient.moveProjectToWorkspace(args, requestId)
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
        return this.projectClient.moveProjectToPersonal(args, requestId)
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
        return this.projectClient.getArchivedProjectsCount(args)
    }

    /**
     * Retrieves the role-to-action permission mappings for projects.
     *
     * @returns A promise that resolves to the permission mappings.
     */
    async getProjectPermissions(): Promise<GetProjectPermissionsResponse> {
        return this.projectClient.getProjectPermissions()
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
        return this.projectClient.getFullProject(id, args)
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
        return this.projectClient.joinProject(id, requestId)
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
        return this.projectClient.getProjectCollaborators(projectId, args)
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
        return this.insightsClient.getProjectActivityStats(projectId, args)
    }

    /**
     * Retrieves the health status of a project.
     *
     * @param projectId - The unique identifier of the project.
     * @returns A promise that resolves to the project health data.
     */
    async getProjectHealth(projectId: string): Promise<ProjectHealth> {
        return this.insightsClient.getProjectHealth(projectId)
    }

    /**
     * Retrieves the health context for a project, including metrics and task details.
     *
     * @param projectId - The unique identifier of the project.
     * @returns A promise that resolves to the project health context.
     */
    async getProjectHealthContext(projectId: string): Promise<ProjectHealthContext> {
        return this.insightsClient.getProjectHealthContext(projectId)
    }

    /**
     * Retrieves progress information for a project.
     *
     * @param projectId - The unique identifier of the project.
     * @returns A promise that resolves to the project progress data.
     */
    async getProjectProgress(projectId: string): Promise<ProjectProgress> {
        return this.insightsClient.getProjectProgress(projectId)
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
        return this.insightsClient.getWorkspaceInsights(workspaceId, args)
    }

    /**
     * Triggers a health analysis for a project.
     *
     * @param projectId - The unique identifier of the project.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated project health data.
     */
    async analyzeProjectHealth(projectId: string, requestId?: string): Promise<ProjectHealth> {
        return this.insightsClient.analyzeProjectHealth(projectId, requestId)
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
        return this.sectionClient.getSections(args)
    }

    /**
     * Searches sections by name.
     *
     * @param args - Search parameters including the query string.
     * @returns A promise that resolves to a paginated response of sections.
     */
    async searchSections(args: SearchSectionsArgs): Promise<GetSectionsResponse> {
        return this.sectionClient.searchSections(args)
    }

    /**
     * Retrieves a single section by its ID.
     *
     * @param id - The unique identifier of the section.
     * @returns A promise that resolves to the requested section.
     */
    async getSection(id: string): Promise<Section> {
        return this.sectionClient.getSection(id)
    }

    /**
     * Creates a new section within a project.
     *
     * @param args - Section creation parameters such as name or project ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created section.
     */
    async addSection(args: AddSectionArgs, requestId?: string): Promise<Section> {
        return this.sectionClient.addSection(args, requestId)
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
        return this.sectionClient.updateSection(id, args, requestId)
    }

    /**
     * Deletes a section by its ID.
     *
     * @param id - The unique identifier of the section to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteSection(id: string, requestId?: string): Promise<boolean> {
        return this.sectionClient.deleteSection(id, requestId)
    }

    /**
     * Archives a section by its ID.
     *
     * @param id - The unique identifier of the section to archive.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated section.
     */
    async archiveSection(id: string, requestId?: string): Promise<Section> {
        return this.sectionClient.archiveSection(id, requestId)
    }

    /**
     * Unarchives a section by its ID.
     *
     * @param id - The unique identifier of the section to unarchive.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the updated section.
     */
    async unarchiveSection(id: string, requestId?: string): Promise<Section> {
        return this.sectionClient.unarchiveSection(id, requestId)
    }

    /**
     * Retrieves a label by its ID.
     *
     * @param id - The unique identifier of the label.
     * @returns A promise that resolves to the requested label.
     */
    async getLabel(id: string): Promise<Label> {
        return this.labelClient.getLabel(id)
    }

    /**
     * Retrieves all labels.
     *
     * @param args - Optional filter parameters.
     * @returns A promise that resolves to an array of labels.
     */
    async getLabels(args: GetLabelsArgs = {}): Promise<GetLabelsResponse> {
        return this.labelClient.getLabels(args)
    }

    /**
     * Searches labels by name.
     *
     * @param args - Search parameters including the query string.
     * @returns A promise that resolves to a paginated response of labels.
     */
    async searchLabels(args: SearchLabelsArgs): Promise<GetLabelsResponse> {
        return this.labelClient.searchLabels(args)
    }

    /**
     * Adds a new label.
     *
     * @param args - Label creation parameters such as name.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created label.
     */
    async addLabel(args: AddLabelArgs, requestId?: string): Promise<Label> {
        return this.labelClient.addLabel(args, requestId)
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
        return this.labelClient.updateLabel(id, args, requestId)
    }

    /**
     * Deletes a label by its ID.
     *
     * @param id - The unique identifier of the label to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteLabel(id: string, requestId?: string): Promise<boolean> {
        return this.labelClient.deleteLabel(id, requestId)
    }

    /**
     * Retrieves a list of shared labels.
     *
     * @param args - Optional parameters to filter shared labels.
     * @returns A promise that resolves to an array of shared labels.
     */
    async getSharedLabels(args?: GetSharedLabelsArgs): Promise<GetSharedLabelsResponse> {
        return this.labelClient.getSharedLabels(args)
    }

    /**
     * Renames an existing shared label.
     *
     * @param args - Parameters for renaming the shared label, including the current and new name.
     * @returns A promise that resolves to `true` if successful.
     */
    async renameSharedLabel(args: RenameSharedLabelArgs): Promise<boolean> {
        return this.labelClient.renameSharedLabel(args)
    }

    /**
     * Removes a shared label.
     *
     * @param args - Parameters for removing the shared label.
     * @returns A promise that resolves to `true` if successful.
     */
    async removeSharedLabel(args: RemoveSharedLabelArgs): Promise<boolean> {
        return this.labelClient.removeSharedLabel(args)
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
        return this.commentClient.getComments(args)
    }

    /**
     * Retrieves a specific comment by its ID.
     *
     * @param id - The unique identifier of the comment to retrieve.
     * @returns A promise that resolves to the requested comment.
     */
    async getComment(id: string): Promise<Comment> {
        return this.commentClient.getComment(id)
    }

    /**
     * Adds a comment to a task or project.
     *
     * @param args - Parameters for creating the comment, such as content and the target task or project ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created comment.
     */
    async addComment(args: AddCommentArgs, requestId?: string): Promise<Comment> {
        return this.commentClient.addComment(args, requestId)
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
        return this.commentClient.updateComment(id, args, requestId)
    }

    /**
     * Deletes a comment by its ID.
     *
     * @param id - The unique identifier of the comment to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteComment(id: string, requestId?: string): Promise<boolean> {
        return this.commentClient.deleteComment(id, requestId)
    }

    /**
     * Retrieves a paginated list of time-based reminders.
     *
     * @param args - Optional parameters including task ID filter and pagination.
     * @returns A promise that resolves to a paginated list of reminders.
     */
    async getReminders(args: GetRemindersArgs = {}): Promise<GetRemindersResponse> {
        return this.reminderClient.getReminders(args)
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
        return this.reminderClient.getLocationReminders(args)
    }

    /**
     * Retrieves a time-based reminder by its ID.
     *
     * @param id - The unique identifier of the reminder to retrieve.
     * @returns A promise that resolves to the requested reminder.
     */
    async getReminder(id: string): Promise<Reminder> {
        return this.reminderClient.getReminder(id)
    }

    /**
     * Retrieves a location reminder by its ID.
     *
     * @param id - The unique identifier of the location reminder to retrieve.
     * @returns A promise that resolves to the requested reminder.
     */
    async getLocationReminder(id: string): Promise<Reminder> {
        return this.reminderClient.getLocationReminder(id)
    }

    /**
     * Creates a time-based reminder for a task.
     *
     * @param args - Reminder creation parameters for relative or absolute reminders.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created reminder.
     */
    async addReminder(args: AddReminderArgs, requestId?: string): Promise<Reminder> {
        return this.reminderClient.addReminder(args, requestId)
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
        return this.reminderClient.addLocationReminder(args, requestId)
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
        return this.reminderClient.updateReminder(id, args, requestId)
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
        return this.reminderClient.updateLocationReminder(id, args, requestId)
    }

    /**
     * Deletes a time-based reminder by its ID.
     *
     * @param id - The unique identifier of the reminder to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteReminder(id: string, requestId?: string): Promise<boolean> {
        return this.reminderClient.deleteReminder(id, requestId)
    }

    /**
     * Deletes a location reminder by its ID.
     *
     * @param id - The unique identifier of the location reminder to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteLocationReminder(id: string, requestId?: string): Promise<boolean> {
        return this.reminderClient.deleteLocationReminder(id, requestId)
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
        return this.folderClient.getFolders(args)
    }

    /**
     * Retrieves a single folder by its ID.
     *
     * @param id - The unique identifier of the folder.
     * @returns A promise that resolves to the requested folder.
     */
    async getFolder(id: string): Promise<Folder> {
        return this.folderClient.getFolder(id)
    }

    /**
     * Creates a new folder.
     *
     * @param args - Folder creation parameters including name and workspace ID.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to the created folder.
     */
    async addFolder(args: AddFolderArgs, requestId?: string): Promise<Folder> {
        return this.folderClient.addFolder(args, requestId)
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
        return this.folderClient.updateFolder(id, args, requestId)
    }

    /**
     * Deletes a folder by its ID.
     *
     * @param id - The unique identifier of the folder to delete.
     * @param requestId - Optional custom identifier for the request.
     * @returns A promise that resolves to `true` if successful.
     */
    async deleteFolder(id: string, requestId?: string): Promise<boolean> {
        return this.folderClient.deleteFolder(id, requestId)
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
        args: { workspaceId?: string } = {},
        requestId?: string,
    ): Promise<AllWorkspaceInvitationsResponse> {
        const queryParams: Record<string, string> = {}
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
