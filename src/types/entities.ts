import {
    Boolean,
    Number as NumberRunType,
    String,
    Array,
    Record,
    Static,
    Partial,
    Literal,
    Union,
} from 'runtypes'

export const Int = NumberRunType.withConstraint(
    (n) => Number.isInteger(n) || `${n} is not a valid entity id. Should be an integer`,
)

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
    id: Int,
    order: Int,
    content: String,
    projectId: Int,
    sectionId: Int,
    completed: Boolean,
    labelIds: Array(Int),
    priority: Int,
    commentCount: Int,
    created: String,
    url: String,
}).And(
    Partial({
        parentId: Int,
        due: DueDate,
        assignee: Int,
    }),
)

export type Task = Static<typeof Task>

export const Project = Record({
    id: Int,
    name: String,
    color: Int,
    commentCount: Int,
    shared: Boolean,
    favorite: Boolean,
}).And(
    Partial({
        parentId: Int,
        order: Int,
        inboxProject: Boolean,
        teamInbox: Boolean,
        syncId: Int,
    }),
)

export type Project = Static<typeof Project>

export const Section = Record({
    id: Int,
    order: Int,
    name: String,
    projectId: Int,
})

export type Section = Static<typeof Section>

export const Label = Record({
    id: Int,
    order: Int,
    name: String,
    color: Int,
    favorite: Boolean,
})

export type Label = Static<typeof Label>

export const Attachment = Partial({
    fileName: String,
    fileSize: Int,
    fileType: String,
    fileUrl: String,
    uploadState: Union(Literal('pending'), Literal('completed')),
})

export type Attachment = Static<typeof Attachment>

export const Comment = Record({
    id: Int,
    content: String,
    posted: String,
}).And(
    Partial({
        taskId: Int,
        projectId: Int,
        attachment: Attachment,
    }),
)

export type Comment = Static<typeof Comment>

export const User = Record({
    id: Int,
    name: String,
    email: String,
})

export type User = Static<typeof User>

export type Color = TodoistEntity & {
    name: string
    value: string
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
    due: {
        date: string
        timezone: string | null
        isRecurring: boolean
        string: string
        lang: string
    } | null
}
