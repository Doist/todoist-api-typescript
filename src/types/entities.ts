export type DueDate = {
    recurring: boolean
    string: string
    date: string
    datetime?: Date
    timezone?: string
}

export type TodoistEntity = {
    id: number
}

export type OrderedEntity = TodoistEntity & {
    order: number
}

export type EntityInHierarchy = OrderedEntity & {
    parentId?: number
}

export type Task = EntityInHierarchy & {
    content: string
    projectId: number
    sectionId: number
    completed: boolean
    labelIds: number[]
    priority: number
    commentCount: number
    created: Date
    url: string
    due?: DueDate
}
