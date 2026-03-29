import { z } from 'zod'
import { DueDateSchema } from '../tasks/types'
import type { Reminder, LocationReminder } from '../sync/resources/reminders'
import { LOCATION_TRIGGERS, ReminderTypeEnum } from '../sync/resources/reminders'

/** Available reminder delivery services. */
export const REMINDER_DELIVERY_SERVICES = ['email', 'push'] as const
/** Delivery service for a reminder notification. */
export type ReminderDeliveryService = (typeof REMINDER_DELIVERY_SERVICES)[number]

export const ReminderDeliveryServiceSchema = z.enum(REMINDER_DELIVERY_SERVICES)

export const ReminderIdSchema = z.string()

export const ReminderDueDateSchema = DueDateSchema.pick({
    date: true,
    string: true,
    timezone: true,
    lang: true,
    isRecurring: true,
})
    .partial()
    .strict()

export type ReminderDueDate = z.infer<typeof ReminderDueDateSchema>

// ── Add schemas ──────────────────────────────────────────────────────

export const AddRelativeReminderArgsSchema = z
    .object({
        taskId: z.string(),
        reminderType: z.literal(ReminderTypeEnum.Relative).optional(),
        minuteOffset: z.number().int(),
        service: ReminderDeliveryServiceSchema.optional(),
        notifyUid: z.string().optional(),
        isUrgent: z.boolean().optional(),
    })
    .strict()

export type AddRelativeReminderArgs = z.infer<typeof AddRelativeReminderArgsSchema>

export const AddAbsoluteReminderArgsSchema = z
    .object({
        taskId: z.string(),
        reminderType: z.literal(ReminderTypeEnum.Absolute),
        due: ReminderDueDateSchema,
        service: ReminderDeliveryServiceSchema.optional(),
        notifyUid: z.string().optional(),
        isUrgent: z.boolean().optional(),
    })
    .strict()

export type AddAbsoluteReminderArgs = z.infer<typeof AddAbsoluteReminderArgsSchema>

export const AddReminderArgsSchema = z.union([
    AddRelativeReminderArgsSchema,
    AddAbsoluteReminderArgsSchema,
])

/**
 * Arguments for creating a new reminder.
 * @see https://developer.todoist.com/api/v1/#tag/Reminders/operation/create_reminder_api_v1_reminders_post
 */
export type AddReminderArgs = AddRelativeReminderArgs | AddAbsoluteReminderArgs

export const AddLocationReminderArgsSchema = z
    .object({
        taskId: z.string(),
        notifyUid: z.string().optional(),
        name: z.string(),
        locLat: z.string(),
        locLong: z.string(),
        locTrigger: z.enum(LOCATION_TRIGGERS),
        radius: z.number().int().optional(),
    })
    .strict()

export type AddLocationReminderArgs = z.infer<typeof AddLocationReminderArgsSchema>

// ── Update schemas ───────────────────────────────────────────────────

export const UpdateRelativeReminderArgsSchema = z
    .object({
        reminderType: z.literal(ReminderTypeEnum.Relative),
        minuteOffset: z.number().int().optional(),
        notifyUid: z.string().optional(),
        service: ReminderDeliveryServiceSchema.optional(),
        isUrgent: z.boolean().optional(),
    })
    .strict()

export type UpdateRelativeReminderArgs = z.infer<typeof UpdateRelativeReminderArgsSchema>

export const UpdateAbsoluteReminderArgsSchema = z
    .object({
        reminderType: z.literal(ReminderTypeEnum.Absolute),
        due: ReminderDueDateSchema.optional(),
        notifyUid: z.string().optional(),
        service: ReminderDeliveryServiceSchema.optional(),
        isUrgent: z.boolean().optional(),
    })
    .strict()

export type UpdateAbsoluteReminderArgs = z.infer<typeof UpdateAbsoluteReminderArgsSchema>

export const UpdateReminderArgsSchema = z
    .discriminatedUnion('reminderType', [
        UpdateRelativeReminderArgsSchema,
        UpdateAbsoluteReminderArgsSchema,
    ])
    .refine(
        (args) =>
            Object.entries(args).some(
                ([key, value]) => key !== 'reminderType' && value !== undefined,
            ),
        {
            message: 'At least one reminder field must be provided to updateReminder',
        },
    )

/**
 * Arguments for updating an existing reminder.
 * @see https://developer.todoist.com/api/v1/#tag/Reminders/operation/update_reminder_api_v1_reminders__reminder_id__post
 */
export type UpdateReminderArgs = UpdateRelativeReminderArgs | UpdateAbsoluteReminderArgs

export const UpdateLocationReminderArgsSchema = z
    .object({
        notifyUid: z.string().optional(),
        name: z.string().optional(),
        locLat: z.string().optional(),
        locLong: z.string().optional(),
        locTrigger: z.enum(LOCATION_TRIGGERS).optional(),
        radius: z.number().int().optional(),
    })
    .strict()
    .refine((args) => Object.values(args).some((value) => value !== undefined), {
        message: 'At least one reminder field must be provided to updateLocationReminder',
    })

/**
 * Arguments for updating an existing location reminder.
 */
export type UpdateLocationReminderArgs = z.infer<typeof UpdateLocationReminderArgsSchema>

// ── Get/Response types ───────────────────────────────────────────────

/**
 * Arguments for listing reminders.
 * @see https://developer.todoist.com/api/v1/#tag/Reminders/operation/get_reminders_api_v1_reminders_get
 */
export type GetRemindersArgs = {
    /** Filter by task ID. */
    taskId?: string | null
    /** Cursor for pagination. */
    cursor?: string | null
    /** Number of results per page (max 200, default 50). */
    limit?: number
}

/**
 * Paginated response for reminders.
 */
export type GetRemindersResponse = {
    results: Reminder[]
    nextCursor: string | null
}

/**
 * Arguments for listing location reminders.
 * @see https://developer.todoist.com/api/v1/#tag/Location-reminders/operation/get_location_reminders_api_v1_location_reminders_get
 */
export type GetLocationRemindersArgs = {
    /** Filter by task ID. */
    taskId?: string | null
    /** Cursor for pagination. */
    cursor?: string | null
    /** Number of results per page (max 200, default 50). */
    limit?: number
}

/**
 * Paginated response for location reminders.
 */
export type GetLocationRemindersResponse = {
    results: LocationReminder[]
    nextCursor: string | null
}
