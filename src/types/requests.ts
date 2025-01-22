import type { RequireAllOrNone, RequireOneOrNone, RequireExactlyOne } from 'type-fest'
import type {
    Comment,
    Duration,
    Label,
    Project,
    ProjectViewStyle,
    Section,
    Task,
    User,
} from './entities'

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

export type QuickAddTaskArgs = {
    text: string
    note?: string
    reminder?: string
    autoReminder?: boolean
    meta?: boolean
}

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
export type GetTasksResponse = {
    results: Task[]
    nextCursor: string | null
}

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

export type GetProjectsArgs = {
    cursor?: string | null
    limit?: number
}
export type GetProjectsResponse = {
    results: Project[]
    nextCursor: string | null
}

export type AddProjectArgs = {
    name: string
    parentId?: string
    color?: string | number
    isFavorite?: boolean
    viewStyle?: ProjectViewStyle
}

export type UpdateProjectArgs = {
    name?: string
    color?: string
    isFavorite?: boolean
    viewStyle?: ProjectViewStyle
}

export type GetProjectCollaboratorsArgs = {
    cursor?: string | null
    limit?: number
}
export type GetProjectCollaboratorsResponse = {
    results: User[]
    nextCursor: string | null
}

export type GetSectionsArgs = {
    projectId: string | null
    cursor?: string | null
    limit?: number
}
export type GetSectionsResponse = {
    results: Section[]
    nextCursor: string | null
}

export type AddSectionArgs = {
    name: string
    projectId: string
    order?: number | null
}

export type UpdateSectionArgs = {
    name: string
}

export type GetLabelsArgs = {
    cursor?: string | null
    limit?: number
}
export type GetLabelsResponse = {
    results: Label[]
    nextCursor: string | null
}

export type AddLabelArgs = {
    name: string
    order?: number | null
    color?: string | number
    isFavorite?: boolean
}

export type UpdateLabelArgs = {
    name?: string
    order?: number | null
    color?: string
    isFavorite?: boolean
}

export type GetCommentsBaseArgs = {
    cursor?: string | null
    limit?: number
}
export type GetCommentsResponse = {
    results: Comment[]
    nextCursor: string | null
}

export type GetTaskCommentsArgs = GetCommentsBaseArgs & {
    taskId: string
    projectId?: never
}

export type GetProjectCommentsArgs = GetCommentsBaseArgs & {
    projectId: string
    taskId?: never
}

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

export type UpdateCommentArgs = {
    content: string
}

export type GetSharedLabelsArgs = {
    omitPersonal?: boolean
    cursor?: string | null
    limit?: number
}
export type GetSharedLabelsResponse = {
    results: string[]
    nextCursor: string | null
}

export type RenameSharedLabelArgs = {
    name: string
    newName: string
}

export type RemoveSharedLabelArgs = {
    name: string
}
