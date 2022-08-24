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
    (n) => Number.isInteger(n) || `${n} is not a valid entity id. Should be a string`,
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
    isRecurring: Boolean,
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
    id: String,
    order: Int,
    content: String,
    description: String,
    projectId: String,
    isCompleted: Boolean,
    labels: Array(String),
    priority: Int,
    commentCount: Int,
    createdAt: String,
    url: String,
}).And(
    Partial({
        due: DueDate,
        assigneeId: String,
        assignerId: String,
        parentId: String,
        sectionId: String,
    }),
)

export type Task = Static<typeof Task>

export const Project = Record({
    id: String,
    name: String,
    color: String,
    commentCount: Int,
    isShared: Boolean,
    isFavorite: Boolean,
    url: String,
    isInboxProject: Boolean,
    isTeamInbox: Boolean,
    order: Int,
    viewStyle: String,
}).And(
    Partial({
        parentId: String,
    }),
)

export type Project = Static<typeof Project>

export const Section = Record({
    id: String,
    order: Int,
    name: String,
    projectId: String,
})

export type Section = Static<typeof Section>

export const Label = Record({
    id: String,
    order: Int,
    name: String,
    color: String,
    isFavorite: Boolean,
})

export type Label = Static<typeof Label>

export const Attachment = Record({
    resourceType: String,
}).And(
    Partial({
        fileName: String,
        fileSize: Int,
        fileType: String,
        fileUrl: String,
        fileDuration: Int,
        uploadState: Union(Literal('pending'), Literal('completed')),
        image: String,
        imageWidth: Int,
        imageHeight: Int,
        url: String,
        title: String,
    }),
)

export type Attachment = Static<typeof Attachment>

export const Comment = Record({
    id: String,
    content: String,
    postedAt: String,
}).And(
    Partial({
        taskId: String,
        projectId: String,
        attachment: Attachment,
    }),
)

export type Comment = Static<typeof Comment>

export const User = Record({
    id: String,
    name: String,
    email: String,
})

export type User = Static<typeof User>

export type Color = TodoistEntity & {
    name: string
    value: string
}

export type QuickAddTaskResponse = {
    id: string
    projectId: string
    content: string
    description: string
    priority: number
    sectionId: string | null
    parentId: string | null
    childOrder: number // order
    labels: string[] // labelIds
    responsibleUid: string | null
    checked: number // completed
    dateAdded: string // created
    due: {
        date: string
        timezone: string | null
        isRecurring: boolean
        string: string
        lang: string
    } | null
}
