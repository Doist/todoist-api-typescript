import type { DueDate } from '../tasks/types'
import type { LocationTrigger, Reminder, LocationReminder } from '../sync/resources/reminders'

/** Available reminder delivery services. */
export const REMINDER_DELIVERY_SERVICES = ['email', 'push'] as const
/** Delivery service for a reminder notification. */
export type ReminderDeliveryService = (typeof REMINDER_DELIVERY_SERVICES)[number]
export type ReminderDueDate = Partial<
    Pick<DueDate, 'date' | 'string' | 'timezone' | 'lang' | 'isRecurring'>
>

type ReminderTaskArgs = {
    taskId: string
}

type TimeBasedReminderArgs = {
    service?: ReminderDeliveryService
    notifyUid?: string
    isUrgent?: boolean
}

type AddLocationReminderFields = {
    notifyUid?: string
    name: string
    locLat: string
    locLong: string
    locTrigger: LocationTrigger
    radius?: number
}

export type AddRelativeReminderArgs = ReminderTaskArgs & {
    reminderType?: 'relative'
    minuteOffset: number
} & TimeBasedReminderArgs

export type AddAbsoluteReminderArgs = ReminderTaskArgs & {
    reminderType: 'absolute'
    due: ReminderDueDate
} & TimeBasedReminderArgs

export type AddLocationReminderArgs = ReminderTaskArgs & AddLocationReminderFields

/**
 * Arguments for creating a new reminder.
 * @see https://developer.todoist.com/api/v1/#tag/Reminders/operation/create_reminder_api_v1_reminders_post
 */
export type AddReminderArgs = AddRelativeReminderArgs | AddAbsoluteReminderArgs

export type UpdateRelativeReminderArgs = {
    reminderType: 'relative'
} & Partial<Omit<AddRelativeReminderArgs, 'taskId' | 'reminderType'>>

export type UpdateAbsoluteReminderArgs = {
    reminderType: 'absolute'
} & Partial<Omit<AddAbsoluteReminderArgs, 'taskId' | 'reminderType'>>

/**
 * Arguments for updating an existing reminder.
 * @see https://developer.todoist.com/api/v1/#tag/Reminders/operation/update_reminder_api_v1_reminders__reminder_id__post
 */
export type UpdateReminderArgs = UpdateRelativeReminderArgs | UpdateAbsoluteReminderArgs

/**
 * Arguments for updating an existing location reminder.
 */
export type UpdateLocationReminderArgs = Partial<Omit<AddLocationReminderArgs, 'taskId'>>

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
