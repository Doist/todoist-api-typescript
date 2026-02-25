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

export const CalendarAccountSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['google', 'microsoft', 'apple']),
        isDeleted: z.boolean().optional(),
        isEventsEnabled: z.boolean().optional(),
        isTasksEnabled: z.boolean().optional(),
        isAllDayTasksEnabled: z.boolean().optional(),
        pendingOperationUntil: z.string().nullable().optional(),
        calendarsSyncState: z.enum(['synced', 'syncing', 'error']).optional(),
    })
    .passthrough()

export type CalendarAccount = z.infer<typeof CalendarAccountSchema>
