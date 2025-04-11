import { z } from 'zod'

export const DueDateSchema = z
    .object({
        isRecurring: z.boolean(),
        string: z.string(),
        date: z.string(),
    })
    .extend({
        datetime: z.string().nullable().optional(),
        timezone: z.string().nullable().optional(),
        lang: z.string().nullable().optional(),
    })
/**
 * Represents a due date for a task.
 * @see https://todoist.com/api/v1/docs#tag/Tasks/operation/get_tasks_api_v1_tasks_get
 */
export interface DueDate extends z.infer<typeof DueDateSchema> {}

export const DurationSchema = z.object({
    amount: z.number().positive('Value should be greater than zero'),
    unit: z.enum(['minute', 'day']),
})
/**
 * Represents a duration for a task deadline.
 * @see https://todoist.com/api/v1/docs#tag/Tasks
 */
export interface Duration extends z.infer<typeof DurationSchema> {}

export const DeadlineSchema = z.object({
    date: z.string(),
    lang: z.string(),
})
/**
 * Represents a task deadline.
 */
export interface Deadline extends z.infer<typeof DeadlineSchema> {}

export const RawTaskSchema = z.object({
    userId: z.string(),
    id: z.string(),
    projectId: z.string(),
    sectionId: z.string().nullable(),
    parentId: z.string().nullable(),
    addedByUid: z.string(),
    assignedByUid: z.string().nullable(),
    responsibleUid: z.string().nullable(),
    labels: z.array(z.string()),
    deadline: DeadlineSchema.nullable(),
    duration: DurationSchema.nullable(),
    checked: z.boolean(),
    isDeleted: z.boolean(),
    addedAt: z.string(),
    completedAt: z.string().nullable(),
    updatedAt: z.string(),
    due: DueDateSchema.nullable(),
    priority: z.number().int(),
    childOrder: z.number().int(),
    content: z.string(),
    description: z.string(),
    dayOrder: z.number().int(),
    isCollapsed: z.boolean(),
})

export interface RawTask extends z.infer<typeof RawTaskSchema> {}

export const TaskSchema = z.object({
    id: z.string(),
    assignerId: z.string().nullable(),
    assigneeId: z.string().nullable(),
    projectId: z.string(),
    sectionId: z.string().nullable(),
    parentId: z.string().nullable(),
    order: z.number().int(),
    content: z.string(),
    description: z.string(),
    isCompleted: z.boolean(),
    labels: z.array(z.string()),
    priority: z.number().int(),
    creatorId: z.string(),
    createdAt: z.string(),
    due: DueDateSchema.nullable(),
    url: z.string(),
    duration: DurationSchema.nullable(),
    deadline: DeadlineSchema.nullable(),
})
/**
 * Represents a task in Todoist.
 * @see https://todoist.com/api/v1/docs#tag/Tasks
 */
export interface Task extends z.infer<typeof TaskSchema> {}

export const RawProjectSchema = z.object({
    id: z.string(),
    canAssignTasks: z.boolean(),
    childOrder: z.number().int().nullable(),
    color: z.string(),
    createdAt: z.string(),
    isArchived: z.boolean(),
    isDeleted: z.boolean(),
    isFavorite: z.boolean(),
    isFrozen: z.boolean(),
    name: z.string(),
    updatedAt: z.string(),
    viewStyle: z.string(),
    defaultOrder: z.number().int().nullable(),
    description: z.string(),
    publicAccess: z.boolean(),
    parentId: z.string().nullable(),
    inboxProject: z.boolean(),
    isCollapsed: z.boolean(),
    isShared: z.boolean(),
})
export interface RawProject extends z.infer<typeof RawProjectSchema> {}

export const ProjectSchema = z.object({
    id: z.string(),
    parentId: z.string().nullable(),
    order: z.number().int().nullable(),
    color: z.string(),
    name: z.string(),
    isShared: z.boolean(),
    isFavorite: z.boolean(),
    isInboxProject: z.boolean(),
    isTeamInbox: z.boolean(),
    url: z.string(),
    viewStyle: z.string(),
})
/**
 * Represents a project in Todoist.
 * @see https://todoist.com/api/v1/docs#tag/Projects
 */
export interface Project extends z.infer<typeof ProjectSchema> {}

// This allows us to accept any string during validation, but provide intellisense for the two possible values in request args
/**
 * @see https://todoist.com/api/v1/docs#tag/Projects
 */
export type ProjectViewStyle = 'list' | 'board' | 'calendar'

export const SectionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    projectId: z.string(),
    addedAt: z.string(),
    updatedAt: z.string(),
    archivedAt: z.string().nullable(),
    name: z.string(),
    sectionOrder: z.number().int(),
    isArchived: z.boolean(),
    isDeleted: z.boolean(),
    isCollapsed: z.boolean(),
})
/**
 * Represents a section in a Todoist project.
 * @see https://todoist.com/api/v1/docs#tag/Sections
 */
export interface Section extends z.infer<typeof SectionSchema> {}

export const LabelSchema = z.object({
    id: z.string(),
    order: z.number().int().nullable(),
    name: z.string(),
    color: z.string(),
    isFavorite: z.boolean(),
})
/**
 * Represents a label in Todoist.
 * @see https://todoist.com/api/v1/docs#tag/Labels
 */
export interface Label extends z.infer<typeof LabelSchema> {}

export const AttachmentSchema = z
    .object({
        resourceType: z.string(),
    })
    .extend({
        fileName: z.string().nullable().optional(),
        fileSize: z.number().int().nullable().optional(),
        fileType: z.string().nullable().optional(),
        fileUrl: z.string().nullable().optional(),
        fileDuration: z.number().int().nullable().optional(),
        uploadState: z.enum(['pending', 'completed']).nullable().optional(),
        image: z.string().nullable().optional(),
        imageWidth: z.number().int().nullable().optional(),
        imageHeight: z.number().int().nullable().optional(),
        url: z.string().nullable().optional(),
        title: z.string().nullable().optional(),
    })
/**
 * Represents a file attachment in a comment.
 * @see https://todoist.com/api/v1/docs#tag/Sync/Comments/File-Attachments
 */
export interface Attachment extends z.infer<typeof AttachmentSchema> {}

export const RawCommentSchema = z
    .object({
        id: z.string(),
        itemId: z.string().optional(),
        projectId: z.string().optional(),
        content: z.string(),
        postedAt: z.string(),
        fileAttachment: AttachmentSchema.nullable(),
        postedUid: z.string(),
        uidsToNotify: z.array(z.string()).nullable(),
        reactions: z.record(z.string(), z.array(z.string())).nullable(),
        isDeleted: z.boolean(),
    })
    .refine(
        (data) => {
            // At least one of itemId or projectId must be present
            return (
                (data.itemId !== undefined && data.projectId === undefined) ||
                (data.itemId === undefined && data.projectId !== undefined)
            )
        },
        {
            message: 'Exactly one of itemId or projectId must be provided',
        },
    )

/**
 * Represents a raw comment response from the API.
 * @see https://todoist.com/api/v1/docs#tag/Comments
 */
export interface RawComment extends z.infer<typeof RawCommentSchema> {}

export const CommentSchema = RawCommentSchema.transform((data) => {
    const { itemId, ...rest } = data
    return {
        ...rest,
        // Map itemId to taskId for backwards compatibility
        taskId: itemId,
    }
})

/**
 * Represents a comment in Todoist.
 * @see https://todoist.com/api/v1/docs#tag/Comments
 */
export interface Comment extends z.infer<typeof CommentSchema> {}

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
})
/**
 * Represents a user in Todoist.
 * @see https://todoist.com/api/v1/docs#tag/User
 */
export interface User extends z.infer<typeof UserSchema> {}

export const ColorSchema = z.object({
    /** @deprecated No longer used */
    id: z.number(),
    /** The key of the color (i.e. 'berry_red') */
    key: z.string(),
    /** The display name of the color (i.e. 'Berry Red') */
    displayName: z.string(),
    /** @deprecated Use {@link Color.displayName} instead */
    name: z.string(),
    /** The hex value of the color (i.e. '#b8255f') */
    hexValue: z.string(),
    /**
     * @deprecated Use {@link Color.hexValue} instead
     */
    value: z.string(),
})
/**
 * Represents a color in Todoist.
 * @see https://todoist.com/api/v1/docs#tag/Colors
 */
export interface Color extends z.infer<typeof ColorSchema> {}
