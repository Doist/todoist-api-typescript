import {
    Boolean,
    Number as NumberValidator,
    String,
    Array,
    Record,
    Static,
    Partial,
    Literal,
    Union,
} from 'runtypes'

export const EntityId = NumberValidator.withConstraint(
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
    id: NumberValidator,
    order: NumberValidator,
    content: String,
    projectId: NumberValidator,
    sectionId: NumberValidator,
    completed: Boolean,
    labelIds: Array(NumberValidator),
    priority: NumberValidator,
    commentCount: NumberValidator,
    created: String,
    url: String,
}).And(
    Partial({
        parentId: NumberValidator,
        due: DueDate,
        assignee: NumberValidator,
    }),
)

export type Task = Static<typeof Task>

export const Project = Record({
    id: NumberValidator,
    name: String,
    color: NumberValidator,
    commentCount: NumberValidator,
    shared: Boolean,
    favorite: Boolean,
}).And(
    Partial({
        parentId: NumberValidator,
        order: NumberValidator,
        inboxProject: Boolean,
        teamInbox: Boolean,
        syncId: NumberValidator,
    }),
)

export type Project = Static<typeof Project>

export const Section = Record({
    id: NumberValidator,
    order: NumberValidator,
    name: String,
    projectId: NumberValidator,
})

export type Section = Static<typeof Section>

export const Label = Record({
    id: NumberValidator,
    order: NumberValidator,
    name: String,
    color: NumberValidator,
    favorite: Boolean,
})

export type Label = Static<typeof Label>

export const Attachment = Partial({
    fileName: String,
    fileSize: NumberValidator,
    fileType: String,
    fileUrl: String,
    uploadState: Union(Literal('pending'), Literal('completed')),
})

export type Attachment = Static<typeof Attachment>

export const Comment = Record({
    id: NumberValidator,
    content: String,
    posted: String,
}).And(
    Partial({
        taskId: NumberValidator,
        projectId: NumberValidator,
        attachment: Attachment,
    }),
)

export type Comment = Static<typeof Comment>

export const User = Record({
    id: NumberValidator,
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
