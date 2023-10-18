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
    Null,
} from 'runtypes'

export const Int = NumberRunType.withConstraint(
    (n) => Number.isInteger(n) || `${n} is not a valid entity id. Should be a string`,
)

export type TodoistEntity = {
    id: string
}

export type OrderedEntity = TodoistEntity & {
    order: number
}

export type EntityInHierarchy = OrderedEntity & {
    parentId?: string | null
}

export const DueDate = Record({
    isRecurring: Boolean,
    string: String,
    date: String,
}).And(
    Partial({
        datetime: String.Or(Null),
        timezone: String.Or(Null),
    }),
)

export type DueDate = Static<typeof DueDate>

export const Duration = Record({
    amount: NumberRunType.withConstraint((n) => n > 0 || 'Value should be greater than zero'),
    unit: Union(Literal('minute'), Literal('day')),
})

export type Duration = Static<typeof Duration>

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
    creatorId: String,
    duration: Duration.Or(Null),
}).And(
    Partial({
        due: DueDate.Or(Null),
        assigneeId: String.Or(Null),
        assignerId: String.Or(Null),
        parentId: String.Or(Null),
        sectionId: String.Or(Null),
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
        parentId: String.Or(Null),
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
        fileName: String.Or(Null),
        fileSize: Int.Or(Null),
        fileType: String.Or(Null),
        fileUrl: String.Or(Null),
        fileDuration: Int.Or(Null),
        uploadState: Union(Literal('pending'), Literal('completed')).Or(Null),
        image: String.Or(Null),
        imageWidth: Int.Or(Null),
        imageHeight: Int.Or(Null),
        url: String.Or(Null),
        title: String.Or(Null),
    }),
)

export type Attachment = Static<typeof Attachment>

export const Comment = Record({
    id: String,
    content: String,
    postedAt: String,
}).And(
    Partial({
        taskId: String.Or(Null),
        projectId: String.Or(Null),
        attachment: Attachment.Or(Null),
    }),
)

export type Comment = Static<typeof Comment>

export const User = Record({
    id: String,
    name: String,
    email: String,
})

export type User = Static<typeof User>

export type Color = {
    /**
     * @deprecated No longer used
     */
    id: number
    /**
     * The key of the color (i.e. 'berry_red')
     */
    key: string
    /**
     * The display name of the color (i.e. 'Berry Red')
     */
    displayName: string
    /**
     * @deprecated Use {@link Color.displayName} instead
     */
    name: string
    /**
     * The hex value of the color (i.e. '#b8255f')
     */
    hexValue: string
    /**
     * @deprecated Use {@link Color.hexValue} instead
     */
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
    labels: string[]
    responsibleUid: string | null
    checked: boolean // completed
    addedAt: string // created
    addedByUid: string | null
    duration: Duration | null
    due: {
        date: string
        timezone: string | null
        isRecurring: boolean
        string: string
        lang: string
    } | null
}
