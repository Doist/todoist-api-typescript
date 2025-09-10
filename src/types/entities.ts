import { z } from 'zod'
import { getProjectUrl, getTaskUrl, getSectionUrl } from '../utils/urlHelpers'

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
export type DueDate = z.infer<typeof DueDateSchema>

export const DurationSchema = z.object({
    amount: z.number().positive('Value should be greater than zero'),
    unit: z.enum(['minute', 'day']),
})
/**
 * Represents a duration for a task deadline.
 * @see https://todoist.com/api/v1/docs#tag/Tasks
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
        addedAt: z.string().nullable(),
        completedAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
        due: DueDateSchema.nullable(),
        priority: z.number().int(),
        childOrder: z.number().int(),
        content: z.string(),
        description: z.string(),
        noteCount: z.number().int(),
        dayOrder: z.number().int(),
        isCollapsed: z.boolean(),
    })
    .transform((data) => {
        return {
            ...data,
            url: getTaskUrl(data.id, data.content),
        }
    })
/**
 * Represents a task in Todoist.
 * @see https://todoist.com/api/v1/docs#tag/Tasks
 */
export type Task = z.infer<typeof TaskSchema>

/**
 * Base schema for all project types in Todoist.
 * Contains common fields shared between personal and workspace projects.
 */
export const BaseProjectSchema = z.object({
    id: z.string(),
    canAssignTasks: z.boolean(),
    childOrder: z.number().int(),
    color: z.string(),
    createdAt: z.string().nullable(),
    isArchived: z.boolean(),
    isDeleted: z.boolean(),
    isFavorite: z.boolean(),
    isFrozen: z.boolean(),
    name: z.string(),
    updatedAt: z.string().nullable(),
    viewStyle: z.string(),
    defaultOrder: z.number().int(),
    description: z.string(),
    isCollapsed: z.boolean(),
    isShared: z.boolean(),
})

/**
 * Schema for personal projects in Todoist.
 */
export const PersonalProjectSchema = BaseProjectSchema.extend({
    parentId: z.string().nullable(),
    inboxProject: z.boolean().optional().default(false),
}).transform((data) => {
    return {
        ...data,
        url: getProjectUrl(data.id, data.name),
    }
})

/**
 * Schema for workspace projects in Todoist.
 */
export const WorkspaceProjectSchema = BaseProjectSchema.extend({
    collaboratorRoleDefault: z.string(),
    folderId: z.string().nullable(),
    isInviteOnly: z.boolean().nullable(),
    isLinkSharingEnabled: z.boolean(),
    role: z.string().nullable(),
    status: z.string(),
    workspaceId: z.string(),
}).transform((data) => {
    return {
        ...data,
        url: getProjectUrl(data.id, data.name),
    }
})

/**
 * Represents a personal project in Todoist.
 * @see https://todoist.com/api/v1/docs#tag/Projects
 */
export type PersonalProject = z.infer<typeof PersonalProjectSchema>

/**
 * Represents a workspace project in Todoist.
 * @see https://todoist.com/api/v1/docs#tag/Projects
 */
export type WorkspaceProject = z.infer<typeof WorkspaceProjectSchema>

// This allows us to accept any string during validation, but provide intellisense for the two possible values in request args
/**
 * @see https://todoist.com/api/v1/docs#tag/Projects
 */
export type ProjectViewStyle = 'list' | 'board' | 'calendar'

export const SectionSchema = z
    .object({
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
    .transform((data) => {
        return {
            ...data,
            url: getSectionUrl(data.id, data.name),
        }
    })
/**
 * Represents a section in a Todoist project.
 * @see https://todoist.com/api/v1/docs#tag/Sections
 */
export type Section = z.infer<typeof SectionSchema>

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
export type Label = z.infer<typeof LabelSchema>

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
export type Attachment = z.infer<typeof AttachmentSchema>

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
export type RawComment = z.infer<typeof RawCommentSchema>

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
export type Comment = z.infer<typeof CommentSchema>

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
})
/**
 * Represents a user in Todoist (simplified for collaborators).
 * @see https://todoist.com/api/v1/docs#tag/User
 */
export type User = z.infer<typeof UserSchema>

export const TimezoneInfoSchema = z.object({
    gmtString: z.string(),
    hours: z.number().int(),
    isDst: z.number().int(),
    minutes: z.number().int(),
    timezone: z.string(),
})

export const CurrentUserSchema = z.object({
    id: z.string(),
    email: z.string(),
    fullName: z.string(),
    avatarBig: z.string().nullable(),
    avatarMedium: z.string().nullable(),
    avatarS640: z.string().nullable(),
    avatarSmall: z.string().nullable(),
    businessAccountId: z.string().nullable(),
    isPremium: z.boolean(),
    dateFormat: z.number().int(),
    timeFormat: z.number().int(),
    weeklyGoal: z.number().int(),
    dailyGoal: z.number().int(),
    completedCount: z.number().int(),
    completedToday: z.number().int(),
    karma: z.number(),
    karmaTrend: z.string(),
    lang: z.string(),
    nextWeek: z.number().int(),
    startDay: z.number().int(),
    startPage: z.string(),
    tzInfo: TimezoneInfoSchema,
    inboxProjectId: z.string(),
    daysOff: z.array(z.number().int()),
    weekendStartDay: z.number().int(),
})
/**
 * Represents the current authenticated user with detailed information.
 * @see https://todoist.com/api/v1/docs#tag/User
 */
export type CurrentUser = z.infer<typeof CurrentUserSchema>

export const ProductivityStatsSchema = z.object({
    completedCount: z.number(),
    daysItems: z.array(
        z.object({
            date: z.string(),
            items: z.array(
                z.object({
                    completed: z.number(),
                    id: z.string(),
                }),
            ),
            totalCompleted: z.number(),
        }),
    ),
    goals: z.object({
        currentDailyStreak: z.object({
            count: z.number(),
            end: z.string(),
            start: z.string(),
        }),
        currentWeeklyStreak: z.object({
            count: z.number(),
            end: z.string(),
            start: z.string(),
        }),
        dailyGoal: z.number(),
        ignoreDays: z.array(z.number()),
        karmaDisabled: z.number(),
        lastDailyStreak: z.object({
            count: z.number(),
            end: z.string(),
            start: z.string(),
        }),
        lastWeeklyStreak: z.object({
            count: z.number(),
            end: z.string(),
            start: z.string(),
        }),
        maxDailyStreak: z.object({
            count: z.number(),
            end: z.string(),
            start: z.string(),
        }),
        maxWeeklyStreak: z.object({
            count: z.number(),
            end: z.string(),
            start: z.string(),
        }),
        user: z.string(),
        userId: z.string(),
        vacationMode: z.number(),
        weeklyGoal: z.number(),
    }),
    karma: z.number(),
    karmaGraphData: z.array(
        z.object({
            date: z.string(),
            karmaAvg: z.number(),
        }),
    ),
    karmaLastUpdate: z.number(),
    karmaTrend: z.string(),
    karmaUpdateReasons: z.array(
        z.object({
            negativeKarma: z.number(),
            negativeKarmaReasons: z.array(z.any()),
            newKarma: z.number(),
            positiveKarma: z.number(),
            positiveKarmaReasons: z.array(z.any()),
            time: z.string(),
        }),
    ),
    projectColors: z.record(z.string(), z.string()),
    weekItems: z.array(
        z.object({
            from: z.string(),
            items: z.array(
                z.object({
                    completed: z.number(),
                    id: z.string(),
                }),
            ),
            to: z.string(),
            totalCompleted: z.number(),
        }),
    ),
})

/**
 * Represents the Productivity stats for the authenticated user.
 * @see https://developer.todoist.com/api/v1/#tag/User/operation/get_productivity_stats_api_v1_tasks_completed_stats_get
 */

export type ProductivityStats = z.infer<typeof ProductivityStatsSchema>

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
export type Color = z.infer<typeof ColorSchema>
