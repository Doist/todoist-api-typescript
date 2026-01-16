import type { RequireAllOrNone, RequireOneOrNone, RequireExactlyOne } from 'type-fest'
import type {
    ActivityEvent,
    ActivityEventType,
    ActivityObjectType,
    Comment,
    Duration,
    Label,
    PersonalProject,
    ProjectViewStyle,
    Section,
    Task,
    User,
    WorkspaceProject,
} from './entities'

/**
 * Arguments for creating a new task.
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/create_task_api_v1_tasks_post
 */
export type AddTaskArgs = {
    content: string
    description?: string
    projectId?: string
    sectionId?: string
    parentId?: string
    order?: number
    labels?: string[]
    priority?: number
    assigneeId?: string
    dueString?: string
    dueLang?: string
    deadlineLang?: string
    deadlineDate?: string
    isUncompletable?: boolean
} & RequireOneOrNone<{
    dueDate?: string
    dueDatetime?: string
}> &
    RequireAllOrNone<{
        duration?: Duration['amount']
        durationUnit?: Duration['unit']
    }>

/**
 * Arguments for retrieving tasks.
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/get_tasks_api_v1_tasks_get
 */
export type GetTasksArgs = {
    projectId?: string
    sectionId?: string
    parentId?: string
    label?: string
    ids?: string[]
    cursor?: string | null
    limit?: number
}

/**
 * Arguments for retrieving tasks by filter.
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/get_tasks_by_filter_api_v1_tasks_filter_get
 */
export type GetTasksByFilterArgs = {
    query: string
    lang?: string
    cursor?: string | null
    limit?: number
}

/**
 * Arguments for retrieving completed tasks by completion date.
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/tasks_completed_by_completion_date_api_v1_tasks_completed_by_completion_date_get
 */
export type GetCompletedTasksByCompletionDateArgs = {
    since: string
    until: string
    workspaceId?: string | null
    projectId?: string | null
    sectionId?: string | null
    parentId?: string | null
    filterQuery?: string | null
    filterLang?: string | null
    cursor?: string | null
    limit?: number
    publicKey?: string | null
}

/**
 * Arguments for retrieving completed tasks by due date.
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/tasks_completed_by_due_date_api_v1_tasks_completed_by_due_date_get
 */
export type GetCompletedTasksByDueDateArgs = {
    since: string
    until: string
    workspaceId?: string | null
    projectId?: string | null
    sectionId?: string | null
    parentId?: string | null
    filterQuery?: string | null
    filterLang?: string | null
    cursor?: string | null
    limit?: number
}

/**
 * Arguments for searching completed tasks.
 */
export type SearchCompletedTasksArgs = {
    query: string
    cursor?: string | null
    limit?: number
}

/**
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/get_tasks_api_v1_tasks_get
 */
export type GetTasksResponse = {
    results: Task[]
    nextCursor: string | null
}

/**
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/tasks_completed_by_due_date_api_v1_tasks_completed_by_due_date_get
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/tasks_completed_by_completion_date_api_v1_tasks_completed_by_completion_date_get
 */
export type GetCompletedTasksResponse = {
    items: Task[]
    nextCursor: string | null
}

/**
 * Arguments for updating a task.
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/update_task_api_v1_tasks__task_id__post
 */
export type UpdateTaskArgs = {
    content?: string
    description?: string
    labels?: string[]
    priority?: number
    dueString?: string
    dueLang?: string | null
    assigneeId?: string | null
    deadlineDate?: string | null
    deadlineLang?: string | null
    isUncompletable?: boolean
} & RequireOneOrNone<{
    dueDate?: string
    dueDatetime?: string
}> &
    RequireAllOrNone<{
        duration?: Duration['amount']
        durationUnit?: Duration['unit']
    }>

/**
 * Arguments for quick adding a task.
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/quick_add_api_v1_tasks_quick_post
 */
export type QuickAddTaskArgs = {
    text: string
    note?: string
    reminder?: string
    autoReminder?: boolean
    meta?: boolean
    isUncompletable?: boolean
}

/**
 * Response from quick adding a task.
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/quick_add_api_v1_tasks_quick_post
 */

/**
 * Arguments for moving a task.
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/move_task_api_v1_tasks__task_id__move_post
 */
export type MoveTaskArgs = RequireExactlyOne<{
    projectId?: string
    sectionId?: string
    parentId?: string
}>

/**
 * Arguments for retrieving projects.
 * @see https://todoist.com/api/v1/docs#tag/Projects/operation/get_projects_api_v1_projects_get
 */
export type GetProjectsArgs = {
    cursor?: string | null
    limit?: number
}

/**
 * Response from retrieving projects.
 * @see https://todoist.com/api/v1/docs#tag/Projects/operation/get_projects_api_v1_projects_get
 */
export type GetProjectsResponse = {
    results: (PersonalProject | WorkspaceProject)[]
    nextCursor: string | null
}

/**
 * Arguments for retrieving archived projects.
 * @see https://todoist.com/api/v1/docs#tag/Projects/operation/get_archived_projects_api_v1_projects_archived_get
 */
export type GetArchivedProjectsArgs = {
    cursor?: string | null
    limit?: number
}

/**
 * Response from retrieving archived projects.
 * @see https://todoist.com/api/v1/docs#tag/Projects/operation/get_archived_projects_api_v1_projects_archived_get
 */
export type GetArchivedProjectsResponse = {
    results: (PersonalProject | WorkspaceProject)[]
    nextCursor: string | null
}

/**
 * Arguments for searching projects.
 */
export type SearchProjectsArgs = {
    query: string
    cursor?: string | null
    limit?: number
}

/**
 * Response from searching projects.
 */
export type SearchProjectsResponse = {
    results: (PersonalProject | WorkspaceProject)[]
    nextCursor: string | null
}

/**
 * Arguments for creating a new project.
 * @see https://todoist.com/api/v1/docs#tag/Projects/operation/create_project_api_v1_projects_post
 */
export type AddProjectArgs = {
    name: string
    parentId?: string
    color?: string | number
    isFavorite?: boolean
    viewStyle?: ProjectViewStyle
}

/**
 * Arguments for updating a project.
 * @see https://todoist.com/api/v1/docs#tag/Projects/operation/update_project_api_v1_projects__project_id__post
 */
export type UpdateProjectArgs = {
    name?: string
    color?: string
    isFavorite?: boolean
    viewStyle?: ProjectViewStyle
}

/**
 * Arguments for retrieving project collaborators.
 * @see https://todoist.com/api/v1/docs#tag/Projects/operation/get_project_collaborators_api_v1_projects__project_id__collaborators_get
 */
export type GetProjectCollaboratorsArgs = {
    cursor?: string | null
    limit?: number
}

/**
 * Response from retrieving project collaborators.
 * @see https://todoist.com/api/v1/docs#tag/Projects/operation/get_project_collaborators_api_v1_projects__project_id__collaborators_get
 */
export type GetProjectCollaboratorsResponse = {
    results: User[]
    nextCursor: string | null
}

/**
 * Arguments for retrieving sections.
 * @see https://todoist.com/api/v1/docs#tag/Sections/operation/get_sections_api_v1_sections_get
 */
export type GetSectionsArgs = {
    projectId?: string | null
    cursor?: string | null
    limit?: number
}

/**
 * Response from retrieving sections.
 * @see https://todoist.com/api/v1/docs#tag/Sections/operation/get_sections_api_v1_sections_get
 */
export type GetSectionsResponse = {
    results: Section[]
    nextCursor: string | null
}

/**
 * Arguments for searching sections.
 */
export type SearchSectionsArgs = {
    query: string
    projectId?: string | null
    cursor?: string | null
    limit?: number
}

/**
 * Response from searching sections.
 */
export type SearchSectionsResponse = {
    results: Section[]
    nextCursor: string | null
}

/**
 * Arguments for creating a new section.
 * @see https://todoist.com/api/v1/docs#tag/Sections/operation/create_section_api_v1_sections_post
 */
export type AddSectionArgs = {
    name: string
    projectId: string
    order?: number | null
}

/**
 * Arguments for updating a section.
 * @see https://todoist.com/api/v1/docs#tag/Sections/operation/update_section_api_v1_sections__section_id__post
 */
export type UpdateSectionArgs = {
    name: string
}

/**
 * Arguments for retrieving labels.
 * @see https://todoist.com/api/v1/docs#tag/Labels/operation/get_labels_api_v1_labels_get
 */
export type GetLabelsArgs = {
    cursor?: string | null
    limit?: number
}

/**
 * Response from retrieving labels.
 * @see https://todoist.com/api/v1/docs#tag/Labels/operation/get_labels_api_v1_labels_get
 */
export type GetLabelsResponse = {
    results: Label[]
    nextCursor: string | null
}

/**
 * Arguments for searching labels.
 */
export type SearchLabelsArgs = {
    query: string
    cursor?: string | null
    limit?: number
}

/**
 * Response from searching labels.
 */
export type SearchLabelsResponse = {
    results: Label[]
    nextCursor: string | null
}

/**
 * Arguments for creating a new label.
 * @see https://todoist.com/api/v1/docs#tag/Labels/operation/create_label_api_v1_labels_post
 */
export type AddLabelArgs = {
    name: string
    order?: number | null
    color?: string | number
    isFavorite?: boolean
}

/**
 * Arguments for updating a label.
 * @see https://todoist.com/api/v1/docs#tag/Labels/operation/update_label_api_v1_labels__label_id__post
 */
export type UpdateLabelArgs = {
    name?: string
    order?: number | null
    color?: string
    isFavorite?: boolean
}

/**
 * Arguments for retrieving shared labels.
 * @see https://todoist.com/api/v1/docs#tag/Labels/operation/shared_labels_api_v1_labels_shared_get
 */
export type GetSharedLabelsArgs = {
    omitPersonal?: boolean
    cursor?: string | null
    limit?: number
}

/**
 * Response from retrieving shared labels.
 * @see https://todoist.com/api/v1/docs#tag/Labels/operation/shared_labels_api_v1_labels_shared_get
 */
export type GetSharedLabelsResponse = {
    results: string[]
    nextCursor: string | null
}

/**
 * Arguments for renaming a shared label.
 * @see https://todoist.com/api/v1/docs#tag/Labels/operation/shared_labels_rename_api_v1_labels_shared_rename_post
 */
export type RenameSharedLabelArgs = {
    name: string
    newName: string
}

/**
 * Arguments for removing a shared label.
 * @see https://todoist.com/api/v1/docs#tag/Labels/operation/shared_labels_remove_api_v1_labels_shared_remove_post
 */
export type RemoveSharedLabelArgs = {
    name: string
}

/**
 * Arguments for retrieving comments.
 * @see https://todoist.com/api/v1/docs#tag/Comments/operation/get_comments_api_v1_comments_get
 */
export type GetCommentsArgs = {
    taskId: string
    projectId?: never
    cursor?: string | null
    limit?: number
}

/**
 * Arguments for retrieving task comments.
 * @see https://todoist.com/api/v1/docs#tag/Comments/operation/get_comments_api_v1_comments_get
 */
export type GetTaskCommentsArgs = {
    taskId: string
    projectId?: never
    cursor?: string | null
    limit?: number
}

/**
 * Arguments for retrieving project comments.
 * @see https://todoist.com/api/v1/docs#tag/Comments/operation/get_comments_api_v1_comments_get
 */
export type GetProjectCommentsArgs = {
    projectId: string
    taskId?: never
    cursor?: string | null
    limit?: number
}

/**
 * Response from retrieving comments.
 * @see https://todoist.com/api/v1/docs#tag/Comments/operation/get_comments_api_v1_comments_get
 */
export type GetCommentsResponse = {
    results: Comment[]
    nextCursor: string | null
}

/**
 * Arguments for creating a new comment.
 * @see https://todoist.com/api/v1/docs#tag/Comments/operation/create_comment_api_v1_comments_post
 */
export type AddCommentArgs = {
    content: string
    attachment?: {
        fileName?: string
        fileUrl: string
        fileType?: string
        resourceType?: string
    } | null
} & RequireExactlyOne<{
    taskId?: string
    projectId?: string
}>

/**
 * Arguments for updating a comment.
 * @see https://todoist.com/api/v1/docs#tag/Comments/operation/update_comment_api_v1_comments__comment_id__post
 */
export type UpdateCommentArgs = {
    content: string
}

/**
 * Arguments for retrieving activity logs.
 */
type GetActivityLogsArgsBase = {
    /**
     * Type of object to filter by (e.g., 'task', 'comment', 'project').
     * Accepts both modern naming ('task', 'comment') and legacy naming ('item', 'note').
     */
    objectType?: ActivityObjectType
    /**
     * Type of event to filter by (e.g., 'added', 'updated', 'deleted', 'completed', 'uncompleted', 'archived', 'unarchived', 'shared', 'left').
     */
    eventType?: ActivityEventType
    /**
     * Filter by the ID of a specific object.
     */
    objectId?: string
    /**
     * Filter events by parent project ID.
     */
    parentProjectId?: string
    /**
     * Filter events by parent task ID.
     */
    parentItemId?: string
    /**
     * When true, includes the parent object data in the response.
     */
    includeParentObject?: boolean
    /**
     * When true, includes child object data in the response.
     */
    includeChildObjects?: boolean
    /**
     * Filter by the user ID who initiated the event.
     */
    initiatorId?: string
    /**
     * When true, filters for events with no initiator (system-generated events).
     * When false, filters for events with an initiator.
     * When null or undefined, no filtering on initiator is applied.
     */
    initiatorIdNull?: boolean | null
    /**
     * When true, ensures the last state of objects is included in the response.
     */
    ensureLastState?: boolean
    /**
     * When true, includes comment annotations in the response.
     */
    annotateNotes?: boolean
    /**
     * When true, includes parent object annotations in the response.
     */
    annotateParents?: boolean
    /**
     * Pagination cursor for retrieving the next page of results.
     */
    cursor?: string | null
    /**
     * Maximum number of results to return per page.
     */
    limit?: number
}

type GetActivityLogsArgsWithDate = GetActivityLogsArgsBase & {
    /**
     * Start date for filtering events (inclusive).
     */
    since?: Date
    /**
     * End date for filtering events (inclusive).
     */
    until?: Date
}

/**
 * @deprecated String dates (YYYY-MM-DD format) are deprecated. Use Date objects instead.
 * This type will be removed in the next major version.
 */
type GetActivityLogsArgsWithString = GetActivityLogsArgsBase & {
    /**
     * Start date for filtering events in YYYY-MM-DD format (inclusive).
     * @deprecated Use Date object instead. String format will be removed in the next major version.
     */
    since?: string
    /**
     * End date for filtering events in YYYY-MM-DD format (inclusive).
     * @deprecated Use Date object instead. String format will be removed in the next major version.
     */
    until?: string
}

export type GetActivityLogsArgs = GetActivityLogsArgsWithDate | GetActivityLogsArgsWithString

/**
 * Response from retrieving activity logs.
 */
export type GetActivityLogsResponse = {
    results: ActivityEvent[]
    nextCursor: string | null
}

/**
 * Arguments for uploading a file.
 * @see https://todoist.com/api/v1/docs#tag/Uploads/operation/upload_file_api_v1_uploads_post
 */
export type UploadFileArgs = {
    /**
     * The file content to upload. Can be:
     * - Buffer: File content as a Buffer (requires fileName)
     * - ReadableStream: File content as a stream (requires fileName)
     * - string: Path to a file on the filesystem (fileName is optional, will be inferred from path)
     */
    file: Buffer | NodeJS.ReadableStream | string
    /**
     * The name of the file. Required for Buffer and Stream inputs.
     * Optional for file path strings (will be inferred from the path if not provided).
     */
    fileName?: string
    /**
     * The project ID to associate the upload with.
     */
    projectId?: string | null
}

/**
 * Arguments for deleting an uploaded file.
 * @see https://todoist.com/api/v1/docs#tag/Uploads/operation/delete_upload_api_v1_uploads_delete
 */
export type DeleteUploadArgs = {
    /**
     * The URL of the file to delete.
     */
    fileUrl: string
}

// Workspace-related types

/**
 * Arguments for getting workspace invitations.
 */
export type GetWorkspaceInvitationsArgs = {
    /**
     * The workspace ID to get invitations for.
     */
    workspaceId: number
}

/**
 * Arguments for deleting a workspace invitation.
 */
export type DeleteWorkspaceInvitationArgs = {
    /**
     * The workspace ID.
     */
    workspaceId: number
    /**
     * The email address of the invitation to delete.
     */
    userEmail: string
}

/**
 * Arguments for accepting/rejecting a workspace invitation.
 */
export type WorkspaceInvitationActionArgs = {
    /**
     * The invitation code from the email.
     */
    inviteCode: string
}

/**
 * Arguments for joining a workspace.
 */
export type JoinWorkspaceArgs = {
    /**
     * Optional invitation code/link to join via.
     */
    inviteCode?: string | null
    /**
     * Optional workspace ID to join via domain auto-join.
     */
    workspaceId?: number | null
}

/**
 * Arguments for uploading/updating workspace logo.
 */
export type WorkspaceLogoArgs = {
    /**
     * The workspace ID.
     */
    workspaceId: number
    /**
     * The image file to upload (Buffer, Stream, or file path).
     */
    file?: Buffer | NodeJS.ReadableStream | string
    /**
     * The file name (required for Buffer/Stream uploads).
     */
    fileName?: string
    /**
     * Whether to delete the logo instead of updating it.
     */
    delete?: boolean
}

/**
 * Arguments for getting workspace plan details.
 */
export type GetWorkspacePlanDetailsArgs = {
    /**
     * The workspace ID.
     */
    workspaceId: number
}

/**
 * Arguments for getting workspace users (paginated).
 */
export type GetWorkspaceUsersArgs = {
    /**
     * Optional workspace ID. If not provided, returns users for all workspaces.
     */
    workspaceId?: number | null
    /**
     * Cursor for pagination.
     */
    cursor?: string | null
    /**
     * Maximum number of users to return (default: 100).
     */
    limit?: number
}

/**
 * Arguments for getting workspace projects (paginated).
 */
export type GetWorkspaceProjectsArgs = {
    /**
     * The workspace ID.
     */
    workspaceId: number
    /**
     * Cursor for pagination.
     */
    cursor?: string | null
    /**
     * Maximum number of projects to return (default: 100).
     */
    limit?: number
}

/**
 * Paginated response for workspace users.
 */
export type GetWorkspaceUsersResponse = {
    /**
     * Whether there are more users available.
     */
    hasMore: boolean
    /**
     * Cursor for the next page of results.
     */
    nextCursor?: string
    /**
     * Array of workspace users.
     */
    workspaceUsers: import('./entities').WorkspaceUser[]
}

/**
 * Response type for workspace invitations endpoint (simple email list).
 */
export type WorkspaceInvitationsResponse = string[]

/**
 * Response type for all workspace invitations endpoint (detailed objects).
 */
export type AllWorkspaceInvitationsResponse = import('./entities').WorkspaceInvitation[]

/**
 * Response type for workspace logo upload.
 */
export type WorkspaceLogoResponse = Record<string, unknown> | null
