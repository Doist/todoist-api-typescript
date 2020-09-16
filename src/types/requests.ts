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
