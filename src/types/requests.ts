import type { RequireAllOrNone, RequireOneOrNone, RequireExactlyOne } from 'type-fest'
import type {
    Comment,
    Deadline,
    DueDate,
    Duration,
    Label,
    Project,
    ProjectViewStyle,
    Section,
    Task,
    User,
} from './entities'

/**
 * @see https://developer.todoist.com/rest/v2/#create-a-new-task
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
 * @see https://developer.todoist.com/rest/v2/#tasks
 */
export type GetTasksArgs = {
    projectId?: string
    sectionId?: string
    label?: string
    filter?: string
    lang?: string
    ids?: string[]
    cursor?: string | null
    limit?: number
}
/**
 * @see https://developer.todoist.com/rest/v2/#tasks
 */
export type GetTasksResponse = {
    results: Task[]
    nextCursor: string | null
}

/**
 * @see https://developer.todoist.com/rest/v2/#update-a-task
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
 * @see https://developer.todoist.com/rest/v2/#quick-add-task
 */
export type QuickAddTaskArgs = {
    text: string
    note?: string
    reminder?: string
    autoReminder?: boolean
    meta?: boolean
}

/**
 * @see https://developer.todoist.com/rest/v2/#quick-add-task
 */
export type QuickAddTaskResponse = {
    id: string
    projectId: string
    content: string
    description: string
    priority: number
    sectionId: string | null
    parentId: string | null
    childOrder: number // order
    labels: string[]
    assignedByUid: string | null
    responsibleUid: string | null
    checked: boolean // completed
    addedAt: string // created
    addedByUid: string | null
    duration: Duration | null
    due: DueDate | null
    deadline: Deadline | null
}

/**
 * @see https://developer.todoist.com/rest/v2/#get-all-projects
 */
export type GetProjectsArgs = {
    cursor?: string | null
    limit?: number
}
/**
 * @see https://developer.todoist.com/rest/v2/#get-all-projects
 */
export type GetProjectsResponse = {
    results: Project[]
    nextCursor: string | null
}

/**
 * @see https://developer.todoist.com/rest/v2/#create-a-new-project
 */
export type AddProjectArgs = {
    name: string
    parentId?: string
    color?: string | number
    isFavorite?: boolean
    viewStyle?: ProjectViewStyle
}

/**
 * @see https://developer.todoist.com/rest/v2/#update-a-project
 */
export type UpdateProjectArgs = {
    name?: string
    color?: string
    isFavorite?: boolean
    viewStyle?: ProjectViewStyle
}

/**
 * @see https://developer.todoist.com/rest/v2/#get-all-collaborators
 */
export type GetProjectCollaboratorsArgs = {
    cursor?: string | null
    limit?: number
}
/**
 * @see https://developer.todoist.com/rest/v2/#get-all-collaborators
 */
export type GetProjectCollaboratorsResponse = {
    results: User[]
    nextCursor: string | null
}

/**
 * @see https://developer.todoist.com/rest/v2/#sections
 */
export type GetSectionsArgs = {
    projectId: string | null
    cursor?: string | null
    limit?: number
}
/**
 * @see https://developer.todoist.com/rest/v2/#sections
 */
export type GetSectionsResponse = {
    results: Section[]
    nextCursor: string | null
}

/**
 * @see https://developer.todoist.com/rest/v2/#create-a-new-section
 */
export type AddSectionArgs = {
    name: string
    projectId: string
    order?: number | null
}

/**
 * @see https://developer.todoist.com/rest/v2/#update-a-section
 */
export type UpdateSectionArgs = {
    name: string
}

/**
 * @see https://developer.todoist.com/rest/v2/#get-all-personal-labels
 */
export type GetLabelsArgs = {
    cursor?: string | null
    limit?: number
}
/**
 * @see https://developer.todoist.com/rest/v2/#get-all-personal-labels
 */
export type GetLabelsResponse = {
    results: Label[]
    nextCursor: string | null
}

/**
 * @see https://developer.todoist.com/rest/v2/#create-a-new-personal-label
 */
export type AddLabelArgs = {
    name: string
    order?: number | null
    color?: string | number
    isFavorite?: boolean
}

/**
 * @see https://developer.todoist.com/rest/v2/#update-a-personal-label
 */
export type UpdateLabelArgs = {
    name?: string
    order?: number | null
    color?: string
    isFavorite?: boolean
}

/**
 * @see https://developer.todoist.com/rest/v2/#get-all-shared-labels
 */
export type GetSharedLabelsArgs = {
    omitPersonal?: boolean
    cursor?: string | null
    limit?: number
}
/**
 * @see https://developer.todoist.com/rest/v2/#get-all-shared-labels
 */
export type GetSharedLabelsResponse = {
    results: string[]
    nextCursor: string | null
}

/**
 * @see https://developer.todoist.com/rest/v2/#rename-shared-labels
 */
export type RenameSharedLabelArgs = {
    name: string
    newName: string
}

/**
 * @see https://developer.todoist.com/rest/v2/#remove-shared-labels
 */
export type RemoveSharedLabelArgs = {
    name: string
}

/**
 * @see https://developer.todoist.com/rest/v2/#get-all-comments
 */
export type GetTaskCommentsArgs = {
    taskId: string
    projectId?: never
    cursor?: string | null
    limit?: number
}
/**
 * @see https://developer.todoist.com/rest/v2/#get-all-comments
 */
export type GetProjectCommentsArgs = {
    projectId: string
    taskId?: never
    cursor?: string | null
    limit?: number
}
/**
 * @see https://developer.todoist.com/rest/v2/#get-all-comments
 */
export type GetCommentsResponse = {
    results: Comment[]
    nextCursor: string | null
}

/**
 * @see https://developer.todoist.com/rest/v2/#create-a-new-comment
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
 * @see https://developer.todoist.com/rest/v2/#update-a-comment
 */
export type UpdateCommentArgs = {
    content: string
}
