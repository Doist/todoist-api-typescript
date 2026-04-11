import { z } from 'zod'
import { hasUncompletablePrefix } from '../../utils/uncompletable-helpers'
import { getTaskUrl } from '../../utils/url-helpers'

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
 * @see https://developer.todoist.com/api/v1/#tag/Tasks/operation/get_tasks_api_v1_tasks_get
 */
export type DueDate = z.infer<typeof DueDateSchema>

/** Available duration units for task deadlines. */
export const DURATION_UNITS = ['minute', 'day'] as const
/** Unit of time for a task duration. */
export type DurationUnit = (typeof DURATION_UNITS)[number]

export const DurationSchema = z.object({
    amount: z.number().positive('Value should be greater than zero'),
    unit: z.enum(DURATION_UNITS),
})
/**
 * Represents a duration for a task deadline.
 * @see https://developer.todoist.com/api/v1/#tag/Tasks
 */
export type Duration = z.infer<typeof DurationSchema>

export const DeadlineSchema = z.object({
    date: z.string(),
    lang: z.string(),
})
/**
 * Represents a task deadline.
 */
export type Deadline = z.infer<typeof DeadlineSchema>

export const TaskSchema = z
    .object({
        id: z.string(),
        userId: z.string(),
        projectId: z.string(),
        sectionId: z.string().nullable(),
        parentId: z.string().nullable(),
        addedByUid: z.string().nullable(),
        assignedByUid: z.string().nullable(),
        responsibleUid: z.string().nullable(),
        labels: z.array(z.string()),
        deadline: DeadlineSchema.nullable(),
        duration: DurationSchema.nullable(),
        checked: z.boolean(),
        isDeleted: z.boolean(),
        addedAt: z.coerce.date().nullable(),
        completedAt: z.coerce.date().nullable(),
        updatedAt: z.coerce.date().nullable(),
        due: DueDateSchema.nullable(),
        priority: z.number().int(),
        childOrder: z.number().int(),
        content: z.string(),
        description: z.string(),
        dayOrder: z.number().int(),
        isCollapsed: z.boolean(),
        isUncompletable: z.boolean().default(false),
    })
    .transform((data) => {
        // Auto-detect uncompletable status from content prefix
        const isUncompletable = hasUncompletablePrefix(data.content)
        return {
            ...data,
            isUncompletable,
            url: getTaskUrl(data.id, data.content),
        }
    })
/**
 * Represents a task in Todoist.
 * @see https://developer.todoist.com/api/v1/#tag/Tasks
 */
export type Task = z.infer<typeof TaskSchema>
