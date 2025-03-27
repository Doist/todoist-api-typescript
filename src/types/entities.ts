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
 * @see https://developer.todoist.com/sync/v9/#due-dates
 */
export interface DueDate extends z.infer<typeof DueDateSchema> {}

export const DurationSchema = z.object({
    amount: z.number().positive('Value should be greater than zero'),
    unit: z.enum(['minute', 'day']),
})
/**
 * Represents the duration of a task.
 * @see https://developer.todoist.com/sync/v9/#deadlines
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
 * A task is a unit of work. It can be a simple to-do item or a more complex task with subtasks, comments, and attachments.
 * @see https://developer.todoist.com/sync/v9/#items
 */
export interface Task extends z.infer<typeof TaskSchema> {}

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
 * Represents a project in Todoist, which can contain multiple tasks.
 * @see https://developer.todoist.com/sync/v9/#projects
 */
export interface Project extends z.infer<typeof ProjectSchema> {}

// This allows us to accept any string during validation, but provide intellisense for the two possible values in request args
/**
 * @see https://developer.todoist.com/sync/v9/#projects
 */
export type ProjectViewStyle = 'list' | 'board' | 'calendar'

export const SectionSchema = z.object({
    id: z.string(),
    order: z.number().int(),
    name: z.string(),
    projectId: z.string(),
})
/**
 * Represents a section within a project, used to group tasks.
 * @see https://developer.todoist.com/sync/v9/#sections
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
 * Represents a label in Todoist, which is used to categorize tasks.
 * @see https://developer.todoist.com/sync/v9/#labels
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
 * Represents an attachment associated with a comment in Todoist.
 * @see https://developer.todoist.com/sync/v9/#file-attachments
 */
export interface Attachment extends z.infer<typeof AttachmentSchema> {}

export const CommentSchema = z.object({
    id: z.string(),
    taskId: z.string().nullable(),
    projectId: z.string().nullable(),
    content: z.string(),
    postedAt: z.string(),
    attachment: AttachmentSchema.nullable(),
})
/**
 * Represents a comment on a task or project in Todoist.
 * @see https://developer.todoist.com/sync/v9/#notes
 */
export interface Comment extends z.infer<typeof CommentSchema> {}

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
})
/**
 * Represents a user in Todoist.
 * @see https://developer.todoist.com/sync/v9/#user
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
 * Represents a color in Todoist, used for projects, labels, or other visual elements.
 * @see https://developer.todoist.com/guides/#colors
 */
export interface Color extends z.infer<typeof ColorSchema> {}
