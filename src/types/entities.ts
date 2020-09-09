export type DueDate = {
    recurring: boolean
    string: string
    date: string
    datetime?: string
    timezone?: string
}

export type TodoistEntity = {
    id: number
}

export type OrderedEntity = TodoistEntity & {
    order?: number
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
    created: string
    url: string
    due?: DueDate
    assignee?: number
}

export type QuickAddTaskResponse = {
    id: number
    projectId: number
    content: string
    priority: number
    sectionId: number | null
    parentId: number | null
    childOrder: number // order
    labels: number[] // labelIds
    responsibleUid: number | null
    checked: number // completed
    dateAdded: string // created
    syncId: number | null
    due: DueDate | null
}

export type Project = EntityInHierarchy & {
    name: string
    color: number
    commentCount: number
    shared: boolean
    favorite: boolean
    inboxProject?: boolean
    teamInbox?: boolean
    syncId?: number
}
