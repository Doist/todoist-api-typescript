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

export const EntityId = NumberRunType.withConstraint(
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
    id: NumberRunType,
    order: NumberRunType,
    content: String,
    projectId: NumberRunType,
    sectionId: NumberRunType,
    completed: Boolean,
    labelIds: Array(NumberRunType),
    priority: NumberRunType,
    commentCount: NumberRunType,
    created: String,
    url: String,
}).And(
    Partial({
        parentId: NumberRunType,
        due: DueDate,
        assignee: NumberRunType,
    }),
)

export type Task = Static<typeof Task>

export const Project = Record({
    id: NumberRunType,
    name: String,
    color: NumberRunType,
    commentCount: NumberRunType,
    shared: Boolean,
    favorite: Boolean,
}).And(
    Partial({
        parentId: NumberRunType,
        order: NumberRunType,
        inboxProject: Boolean,
        teamInbox: Boolean,
        syncId: NumberRunType,
    }),
)

export type Project = Static<typeof Project>

export const Section = Record({
    id: NumberRunType,
    order: NumberRunType,
    name: String,
    projectId: NumberRunType,
})

export type Section = Static<typeof Section>

export const Label = Record({
    id: NumberRunType,
    order: NumberRunType,
    name: String,
    color: NumberRunType,
    favorite: Boolean,
})

export type Label = Static<typeof Label>

export const Attachment = Partial({
    fileName: String,
    fileSize: NumberRunType,
    fileType: String,
    fileUrl: String,
    uploadState: Union(Literal('pending'), Literal('completed')),
})

export type Attachment = Static<typeof Attachment>

export const Comment = Record({
    id: NumberRunType,
    content: String,
    posted: String,
}).And(
    Partial({
        taskId: NumberRunType,
        projectId: NumberRunType,
        attachment: Attachment,
    }),
)

export type Comment = Static<typeof Comment>

export const User = Record({
    id: NumberRunType,
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
