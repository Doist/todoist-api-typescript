import { z } from 'zod'
import { getProjectUrl, getTaskUrl, getSectionUrl } from '../utils/url-helpers'
import { hasUncompletablePrefix } from '../utils/uncompletable-helpers'

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
        /**
         * @deprecated This field is deprecated and will always return 0. It will be removed in a future version. Do not use or rely on this field.
         */
        noteCount: z.number().int(),
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
    avatarBig: z.string().nullish(),
    avatarMedium: z.string().nullish(),
    avatarS640: z.string().nullish(),
    avatarSmall: z.string().nullish(),
    businessAccountId: z.string().nullable(),
    isPremium: z.boolean(),
    premiumStatus: z.enum([
        'not_premium',
        'current_personal_plan',
        'legacy_personal_plan',
        'teams_business_member',
    ]),
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

const StreakSchema = z.object({
    count: z.number(),
    start: z.string(),
    end: z.string(),
})

const CompletedItemSchema = z.object({
    id: z.string(),
    completed: z.number(),
})

const ItemsWithDateSchema = z.object({
    items: z.array(CompletedItemSchema),
    totalCompleted: z.number(),
})

const KarmaUpdateSchema = z.object({
    time: z.string(),
    newKarma: z.number(),
    positiveKarma: z.number(),
    negativeKarma: z.number(),
    positiveKarmaReasons: z.array(z.any()),
    negativeKarmaReasons: z.array(z.any()),
})

export const ProductivityStatsSchema = z.object({
    completedCount: z.number(),
    daysItems: z.array(
        ItemsWithDateSchema.extend({
            date: z.string(),
        }),
    ),
    goals: z.object({
        currentDailyStreak: StreakSchema,
        currentWeeklyStreak: StreakSchema,
        dailyGoal: z.number(),
        ignoreDays: z.array(z.number()),
        karmaDisabled: z.number(),
        lastDailyStreak: StreakSchema,
        lastWeeklyStreak: StreakSchema,
        maxDailyStreak: StreakSchema,
        maxWeeklyStreak: StreakSchema,
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
    karmaUpdateReasons: z.array(KarmaUpdateSchema),
    projectColors: z.record(z.string(), z.string()),
    weekItems: z.array(
        ItemsWithDateSchema.extend({
            from: z.string(),
            to: z.string(),
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

/**
 * @deprecated Use 'task' instead. This will be removed in the next major version.
 */
type DeprecatedItem = 'item'

/**
 * @deprecated Use 'comment' instead. This will be removed in the next major version.
 */
type DeprecatedNote = 'note'

/**
 * Type hints for known object types. Accepts any string for forward compatibility.
 * Supports both modern naming ('task', 'comment') and legacy naming ('item', 'note').
 *
 * **Note**: The legacy values 'item' and 'note' are deprecated. Use 'task' and 'comment' instead.
 */
export type ActivityObjectType =
    | 'task'
    | 'comment'
    | 'project'
    | DeprecatedItem
    | DeprecatedNote
    | (string & Record<string, never>)

/**
 * Type hints for known event types. Accepts any string for forward compatibility.
 */
export type ActivityEventType =
    | 'added'
    | 'updated'
    | 'deleted'
    | 'completed'
    | 'uncompleted'
    | 'archived'
    | 'unarchived'
    | 'shared'
    | 'left'
    | (string & Record<string, never>)

/**
 * Flexible object containing event-specific data.
 * Uses z.record to accept any properties for forward compatibility.
 */
export const ActivityEventExtraDataSchema = z.record(z.string(), z.any()).nullable()
export type ActivityEventExtraData = z.infer<typeof ActivityEventExtraDataSchema>

/**
 * Activity log event schema. Accepts unknown fields for forward compatibility.
 */
export const ActivityEventSchema = z
    .object({
        objectType: z.string(),
        objectId: z.string(),
        eventType: z.string(),
        eventDate: z.string(),
        id: z
            .union([z.string(), z.number()])
            .transform((val) => val?.toString() ?? null)
            .nullable(),
        parentProjectId: z.string().nullable(),
        parentItemId: z.string().nullable(),
        initiatorId: z.string().nullable(),
        extraData: ActivityEventExtraDataSchema,
    })
    .catchall(z.any())

/**
 * Represents an activity log event in Todoist.
 */
export type ActivityEvent = z.infer<typeof ActivityEventSchema>

/**
 * Available workspace roles.
 */
export const WORKSPACE_ROLES = ['ADMIN', 'MEMBER', 'GUEST'] as const

/**
 * Role of a user within a workspace.
 */
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number]

export const WorkspaceRoleSchema = z.enum(WORKSPACE_ROLES)

export const WorkspaceUserSchema = z.object({
    userId: z.string(),
    workspaceId: z.string(),
    userEmail: z.string(),
    fullName: z.string(),
    timezone: z.string(),
    role: WorkspaceRoleSchema,
    imageId: z.string().nullable(),
    isDeleted: z.boolean().default(false),
})

/**
 * Represents a user within a workspace (MemberView from API).
 */
export type WorkspaceUser = z.infer<typeof WorkspaceUserSchema>

export const WorkspaceInvitationSchema = z.object({
    id: z.string().default('0'),
    inviterId: z.string(),
    userEmail: z.string(),
    workspaceId: z.string(),
    role: WorkspaceRoleSchema,
    isExistingUser: z.boolean(),
})

/**
 * Represents a workspace invitation.
 */
export type WorkspaceInvitation = z.infer<typeof WorkspaceInvitationSchema>

export const PlanPriceSchema = z.object({
    currency: z.string(),
    amount: z.union([z.number(), z.string()]),
    interval: z.string().optional(),
})

/**
 * Plan pricing information.
 */
export type PlanPrice = z.infer<typeof PlanPriceSchema>

export const FormattedPriceListingSchema = z.object({
    currency: z.string().optional(),
    amount: z.number().optional(),
    interval: z.string().optional(),
    formatted: z.string().optional(),
})

/**
 * Formatted price listing for workspace plans.
 */
export type FormattedPriceListing = z.infer<typeof FormattedPriceListingSchema>

export const WorkspacePlanDetailsSchema = z.object({
    currentMemberCount: z.number(),
    currentPlan: z.enum(['Business', 'Starter']),
    currentPlanStatus: z.enum(['Active', 'Downgraded', 'Cancelled', 'NeverSubscribed']),
    downgradeAt: z.string().nullable(),
    currentActiveProjects: z.number(),
    maximumActiveProjects: z.number(),
    priceList: z.array(FormattedPriceListingSchema),
    workspaceId: z.number(),
    isTrialing: z.boolean(),
    trialEndsAt: z.string().nullable(),
    cancelAtPeriodEnd: z.boolean(),
    hasTrialed: z.boolean(),
    planPrice: PlanPriceSchema.nullable(),
    hasBillingPortal: z.boolean(),
    hasBillingPortalSwitchToAnnual: z.boolean(),
})

/**
 * Represents workspace plan and billing details.
 */
export type WorkspacePlanDetails = z.infer<typeof WorkspacePlanDetailsSchema>

export const JoinWorkspaceResultSchema = z.object({
    customSortingApplied: z.boolean(),
    projectSortPreference: z.string(),
    role: WorkspaceRoleSchema,
    userId: z.string(),
    workspaceId: z.string(),
})

/**
 * Result returned when successfully joining a workspace.
 */
export type JoinWorkspaceResult = z.infer<typeof JoinWorkspaceResultSchema>

/**
 * Available workspace plans.
 */
export const WORKSPACE_PLANS = ['STARTER', 'BUSINESS'] as const

/**
 * Workspace plan type.
 */
export type WorkspacePlan = (typeof WORKSPACE_PLANS)[number]

export const WorkspacePlanSchema = z.enum(WORKSPACE_PLANS)

/**
 * Workspace resource limits.
 */
export const WorkspaceLimitsSchema = z
    .object({
        current: z.record(z.string(), z.any()).nullable(),
        next: z.record(z.string(), z.any()).nullable(),
    })
    .catchall(z.any())

export type WorkspaceLimits = z.infer<typeof WorkspaceLimitsSchema>

/**
 * Workspace properties (flexible object for unknown fields).
 */
export const WorkspacePropertiesSchema = z.record(z.string(), z.unknown())
export type WorkspaceProperties = z.infer<typeof WorkspacePropertiesSchema>

/**
 * Represents a workspace in Todoist.
 */
export const WorkspaceSchema = z.object({
    id: z.string(),
    name: z.string(),
    plan: WorkspacePlanSchema,
    role: WorkspaceRoleSchema,
    inviteCode: z.string(),
    isLinkSharingEnabled: z.boolean(),
    isGuestAllowed: z.boolean(),
    limits: WorkspaceLimitsSchema,
    logoBig: z.string().nullish(),
    logoMedium: z.string().nullish(),
    logoSmall: z.string().nullish(),
    logoS640: z.string().nullish(),
    createdAt: z.string(),
    creatorId: z.string(),
    properties: WorkspacePropertiesSchema,
})

export type Workspace = z.infer<typeof WorkspaceSchema>
