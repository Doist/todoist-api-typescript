import { z } from 'zod'

export const CalendarSchema = z
    .object({
        id: z.string(),
        summary: z.string(),
        color: z.string().nullable(),
        accountId: z.string(),
        isVisible: z.boolean(),
        isTaskCalendar: z.boolean().optional(),
    })
    .passthrough()

export type Calendar = z.infer<typeof CalendarSchema>

/** Available calendar account provider types. */
export const CALENDAR_ACCOUNT_TYPES = ['google', 'microsoft', 'apple'] as const
/** Calendar account provider type. */
export type CalendarAccountType = (typeof CALENDAR_ACCOUNT_TYPES)[number]

/** Available calendar sync states. */
export const CALENDAR_SYNC_STATES = ['synced', 'syncing', 'error'] as const
/** Sync state of a calendar account. */
export type CalendarSyncState = (typeof CALENDAR_SYNC_STATES)[number]

export const CalendarAccountSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        type: z.enum(CALENDAR_ACCOUNT_TYPES),
        isDeleted: z.boolean().optional(),
        isEventsEnabled: z.boolean().optional(),
        isTasksEnabled: z.boolean().optional(),
        isAllDayTasksEnabled: z.boolean().optional(),
        pendingOperationUntil: z.string().nullable().optional(),
        calendarsSyncState: z.enum(CALENDAR_SYNC_STATES).optional(),
    })
    .passthrough()

export type CalendarAccount = z.infer<typeof CalendarAccountSchema>
