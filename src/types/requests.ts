import type { RequireAllOrNone, RequireOneOrNone, RequireExactlyOne } from 'type-fest'
import type { Duration, Project } from './entities'

export type AddTaskArgs = {
    content: string
    description?: string
    projectId?: string
    sectionId?: string
    parentId?: string
    order?: number
    labels?: string[]
    priority?: number
    dueLang?: string
    assigneeId?: string
} & RequireOneOrNone<{
    dueString?: string
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
}

export type GetTasksArgs = {
    projectId?: string
    sectionId?: string
    label?: string
    filter?: string
    lang?: string
    ids?: string[]
}

export type UpdateTaskArgs = {
    content?: string
    description?: string
    labels?: string[]
    priority?: number
    dueLang?: string | null
    assigneeId?: string | null
} & RequireOneOrNone<{
    dueString?: string
    dueDate?: string
    dueDatetime?: string
}> &
    RequireAllOrNone<{
        duration?: Duration['amount']
        durationUnit?: Duration['unit']
    }>

export type ProjectViewStyle = Project['viewStyle']

export type AddProjectArgs = {
    name: string
    parentId?: string
    color?: string
    isFavorite?: boolean
    viewStyle?: Project['viewStyle']
}

export type UpdateProjectArgs = {
    name?: string
    color?: string
    isFavorite?: boolean
    viewStyle?: ProjectViewStyle
}

export type AddSectionArgs = {
    name: string
    projectId: string
    order?: number
}

export type UpdateSectionArgs = {
    name: string
}

export type AddLabelArgs = {
    name: string
    order?: number
    color?: string
    isFavorite?: boolean
}

export type UpdateLabelArgs = {
    name?: string
    order?: number
    color?: string
    isFavorite?: boolean
}

export type GetTaskCommentsArgs = {
    taskId: string
    projectId?: never
}

export type GetProjectCommentsArgs = {
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
    }
} & RequireExactlyOne<{
    taskId?: string
    projectId?: string
}>

export type AddTaskCommentArgs = AddCommentArgs & {
    taskId: string
    projectId?: never
}

export type AddProjectCommentArgs = AddCommentArgs & {
    projectId: string
    taskId?: never
}

export type UpdateCommentArgs = {
    content: string
}

export type GetSharedLabelsArgs = {
    omitPersonal?: boolean
}

export type RenameSharedLabelArgs = {
    name: string
    newName: string
}

export type RemoveSharedLabelArgs = {
    name: string
}
