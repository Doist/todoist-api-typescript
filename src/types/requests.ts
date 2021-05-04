export type AddTaskArgs = {
    content: string
    description?: string
    projectId?: number
    sectionId?: number
    parentId?: number
    order?: number
    labelIds?: number[]
    priority?: number
    dueString?: string
    dueLang?: string
    dueDate?: string
    dueDatetime?: string
    assignee?: number
}

export type QuickAddTaskArgs = {
    text: string
    note?: string
    reminder?: string
    autoReminder?: boolean
}

export type GetTasksArgs = {
    projectId?: number
    sectionId?: number
    labelId?: number
    filter?: string
    lang?: string
    ids?: number[]
}

export type UpdateTaskArgs = {
    content?: string
    description?: string
    labelIds?: number[]
    priority?: number
    dueString?: string
    dueLang?: string
    dueDate?: string
    dueDatetime?: string
    assignee?: number
}

export type AddProjectArgs = {
    name: string
    parentId?: number
    color?: number
    favorite?: boolean
}

export type UpdateProjectArgs = {
    name?: string
    color?: number
    favorite?: boolean
}

export type AddSectionArgs = {
    name: string
    projectId: number
    order?: number
}

export type UpdateSectionArgs = {
    name: string
}

export type AddLabelArgs = {
    name: string
    order?: number
    color?: number
    favorite?: boolean
}

export type UpdateLabelArgs = {
    name?: string
    order?: number
    color?: number
    favorite?: boolean
}

export type GetTaskCommentsArgs = {
    taskId: number
    projectId?: never
}

export type GetProjectCommentsArgs = {
    projectId: number
    taskId?: never
}

type AddCommentArgs = {
    content: string
    attachment?: {
        fileName?: string
        fileUrl: string
        fileType?: string
    }
}

export type AddTaskCommentArgs = AddCommentArgs & {
    taskId: number
    projectId?: never
}

export type AddProjectCommentArgs = AddCommentArgs & {
    projectId: number
    taskId?: never
}

export type UpdateCommentArgs = {
    content: string
}
