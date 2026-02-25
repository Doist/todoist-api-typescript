import { z } from 'zod'
import { DueDateSchema } from '../../entities'

const ReminderBaseSchema = z.object({
    id: z.string(),
    notifyUid: z.string(),
    itemId: z.string(),
    projectId: z.string().optional(),
    isDeleted: z.boolean(),
})

export const LocationReminderSchema = ReminderBaseSchema.extend({
    type: z.literal('location'),
    name: z.string(),
    locLat: z.string(),
    locLong: z.string(),
    locTrigger: z.enum(['on_enter', 'on_leave']),
    radius: z.number().int(),
}).passthrough()

export type LocationReminder = z.infer<typeof LocationReminderSchema>

export const AbsoluteReminderSchema = ReminderBaseSchema.extend({
    type: z.literal('absolute'),
    due: DueDateSchema,
}).passthrough()

export type AbsoluteReminder = z.infer<typeof AbsoluteReminderSchema>

export const RelativeReminderSchema = ReminderBaseSchema.extend({
    type: z.literal('relative'),
    minuteOffset: z.number().int(),
    due: DueDateSchema.optional(),
}).passthrough()

export type RelativeReminder = z.infer<typeof RelativeReminderSchema>

export const ReminderSchema = z.discriminatedUnion('type', [
    LocationReminderSchema,
    AbsoluteReminderSchema,
    RelativeReminderSchema,
])

export type Reminder = z.infer<typeof ReminderSchema>
