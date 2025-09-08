import type { RequireAllOrNone, RequireOneOrNone, RequireExactlyOne } from 'type-fest'
import type {
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
    projectId: string | null
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
