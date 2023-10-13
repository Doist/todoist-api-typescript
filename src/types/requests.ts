import type { GreaterThanZero, Unit } from './entities'

type AddTask = {
    content: string
    description?: string
    projectId?: string
    sectionId?: string
    parentId?: string
    order?: number
    labels?: string[]
    priority?: number
    dueString?: string
    dueLang?: string
    dueDate?: string
    dueDatetime?: string
    assigneeId?: string
    duration?: GreaterThanZero
    durationUnit?: Unit
}

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

type UpdateTask = {
    content?: string
    description?: string
    labels?: string[]
    priority?: number
    dueString?: string | null
    dueLang?: string | null
    dueDate?: string | null
    dueDatetime?: string | null
    assigneeId?: string | null
    duration?: GreaterThanZero
    durationUnit?: Unit
}

export type ProjectViewStyle = 'list' | 'board'

export type AddProjectArgs = {
    name: string
    parentId?: string
    color?: string
    isFavorite?: boolean
    viewStyle?: ProjectViewStyle
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

type AddCommentArgs = {
    content: string
    attachment?: {
        fileName?: string
        fileUrl: string
        fileType?: string
        resourceType?: string
    }
}

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

export type RenameSharedLabelArgs = {
    name: string
    newName: string
}

export type RemoveSharedLabelArgs = {
    name: string
}

type RequiredKey<T, M, K extends keyof M, R extends keyof M> = K extends keyof T
    ? Omit<M, R> & Required<Pick<M, R>>
    : AddTask

export type AddTaskArgs<T> = RequiredKey<T, AddTask, 'duration', 'durationUnit'> &
    RequiredKey<T, AddTask, 'durationUnit', 'duration'>

export type UpdateTaskArgs<T> = RequiredKey<T, UpdateTask, 'duration', 'durationUnit'> &
    RequiredKey<T, UpdateTask, 'durationUnit', 'duration'>
