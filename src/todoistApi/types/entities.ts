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
    parent_id?: number
}

export type Task = EntityInHierarchy & {
    content: string
    project_id: number
    section_id: number
    completed: boolean
    label_ids: number[]
    priority: number
    comment_count: number
    created: Date
    url: string
    due?: DueDate
}
