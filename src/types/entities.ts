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

export type OrderedEntity = {
    order: number
}

export type EntityInHierarchy = {
    parentId?: number
}

export type Task = TodoistEntity &
    OrderedEntity &
    EntityInHierarchy & {
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

export type Project = TodoistEntity &
    Partial<OrderedEntity> &
    EntityInHierarchy & {
        name: string
        color: number
        commentCount: number
        shared: boolean
        favorite: boolean
        inboxProject?: boolean
        teamInbox?: boolean
        syncId?: number
    }

export type Section = TodoistEntity &
    OrderedEntity & {
        name: string
        projectId: number
    }

export type Label = TodoistEntity &
    OrderedEntity & {
        name: string
        color: number
        favorite: boolean
    }

export type User = TodoistEntity & {
    name: string
    email: string
}

export type Color = {
    name: string
    id: number
    value: string
}
