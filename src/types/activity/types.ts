import { z } from 'zod'

/**
 * Known activity object types, using modern names (`task`, `comment`) rather
 * than legacy API names (`item`, `note`).
 */
export const ACTIVITY_OBJECT_TYPES = ['task', 'comment', 'project'] as const

/**
 * Known activity event types.
 */
export const ACTIVITY_EVENT_TYPES = [
    'added',
    'updated',
    'deleted',
    'completed',
    'uncompleted',
    'archived',
    'unarchived',
    'shared',
    'left',
    'moved',
] as const

// `string & Record<string, never>` is a TypeScript trick that allows any string
// to be passed (for forward compatibility) while still providing autocomplete
// for the known literal values.

/**
 * Type hints for known object types. Accepts any string for forward compatibility.
 */
export type ActivityObjectType =
    | (typeof ACTIVITY_OBJECT_TYPES)[number]
    | (string & Record<string, never>)

/**
 * Type hints for known event types. Accepts any string for forward compatibility.
 */
export type ActivityEventType =
    | (typeof ACTIVITY_EVENT_TYPES)[number]
    | (string & Record<string, never>)

/**
 * Combined object:event filter string for the `objectEventTypes` parameter of `getActivityLogs`.
 *
 * Uses modern object type names (`task`, `comment`) rather than legacy API names (`item`, `note`).
 * Either part may be omitted:
 * - `'task:added'` — task additions only
 * - `'task:'` — all events for tasks
 * - `':deleted'` — all deleted events across all object types
 *
 * The final `string & Record<string, never>` member allows any arbitrary string
 * to be passed for forward compatibility, while still providing autocomplete for
 * the known combinations above.
 */
export type ActivityObjectEventType =
    | `${ActivityObjectType}:${ActivityEventType}`
    | `${ActivityObjectType}:`
    | `:${ActivityEventType}`
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
        eventDate: z.coerce.date(),
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
