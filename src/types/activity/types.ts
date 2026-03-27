import { z } from 'zod'

/**
 * Type hints for known object types. Accepts any string for forward compatibility.
 */
export type ActivityObjectType = 'task' | 'comment' | 'project' | (string & Record<string, never>)

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

// `string & Record<string, never>` is a TypeScript trick that allows any string
// to be passed (for forward compatibility) while still providing autocomplete
// for the known literal values above.
type ModernActivityObjectType = 'task' | 'comment' | 'project' | (string & Record<string, never>)

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
    | `${ModernActivityObjectType}:${ActivityEventType}`
    | `${ModernActivityObjectType}:`
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
