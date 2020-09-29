import { Boolean, Number, String, Array, Record, Static, Partial, Literal, Union } from 'runtypes'

export type TodoistEntity = {
    id: number
}

export type OrderedEntity = TodoistEntity & {
    order: number
}

export type EntityInHierarchy = OrderedEntity & {
    parentId?: number
}

export const DueDate = Record({
    recurring: Boolean,
    string: String,
    date: String,
}).And(
    Partial({
        datetime: String,
        timezone: String,
    }),
)

export type DueDate = Static<typeof DueDate>

export const Task = Record({
    id: Number,
    order: Number,
    content: String,
    projectId: Number,
    sectionId: Number,
    completed: Boolean,
    labelIds: Array(Number),
    priority: Number,
    commentCount: Number,
    created: String,
    url: String,
}).And(
    Partial({
        parentId: Number,
        due: DueDate,
        assignee: Number,
    }),
)

export type Task = Static<typeof Task>

export const Project = Record({
    id: Number,
    name: String,
    color: Number,
    commentCount: Number,
    shared: Boolean,
    favorite: Boolean,
}).And(
    Partial({
        parentId: Number,
        order: Number,
        inboxProject: Boolean,
        teamInbox: Boolean,
        syncId: Number,
    }),
)

export type Project = Static<typeof Project>

export const Section = Record({
    id: Number,
    order: Number,
    name: String,
    projectId: Number,
})

export type Section = Static<typeof Section>

export const Label = Record({
    id: Number,
    order: Number,
    name: String,
    color: Number,
    favorite: Boolean,
})

export type Label = Static<typeof Label>

export const Attachment = Partial({
    fileName: String,
    fileSize: Number,
    fileType: String,
    fileUrl: String,
    uploadState: Union(Literal('pending'), Literal('completed')),
})

export type Attachment = Static<typeof Attachment>

export const Comment = Record({
    id: Number,
    content: String,
    posted: String,
}).And(
    Partial({
        taskId: Number,
        projectId: Number,
        attachment: Attachment,
    }),
)

export type Comment = Static<typeof Comment>

export const User = Record({
    id: Number,
    name: String,
    email: String,
})

export type User = Static<typeof User>

export const Color = Record({
    id: Number,
    name: String,
    value: String,
})

export type Color = Static<typeof Color>

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
    due: {
        date: string
        timezone: string | null
        isRecurring: boolean
        string: string
        lang: string
    } | null
}
