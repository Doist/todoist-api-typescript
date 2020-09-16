export type AddTaskArgs = {
    content: string
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

export type GetTasksArgs = {
    projectId?: number
    labelId?: number
    filter?: string
    lang?: string
    ids?: number[]
}

export type UpdateTaskArgs = {
    content?: string
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
