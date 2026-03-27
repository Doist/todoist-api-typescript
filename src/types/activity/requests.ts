import type { ActivityEvent, ActivityObjectEventType } from './types'

/**
 * Common arguments for retrieving activity logs (excluding filter-type params).
 */
type GetActivityLogsArgsCommon = {
    /**
     * Filter by the ID of a specific object.
     */
    objectId?: string
    /**
     * Filter events by parent project ID.
     */
    parentProjectId?: string
    /**
     * Filter events by parent task ID.
     */
    parentItemId?: string
    /**
     * When true, includes the parent object data in the response.
     */
    includeParentObject?: boolean
    /**
     * When true, includes child object data in the response.
     */
    includeChildObjects?: boolean
    /**
     * Filter by the user ID who initiated the event.
     */
    initiatorId?: string
    /**
     * When true, filters for events with no initiator (system-generated events).
     * When false, filters for events with an initiator.
     * When null or undefined, no filtering on initiator is applied.
     */
    initiatorIdNull?: boolean | null
    /**
     * When true, ensures the last state of objects is included in the response.
     */
    ensureLastState?: boolean
    /**
     * When true, includes comment annotations in the response.
     */
    annotateNotes?: boolean
    /**
     * When true, includes parent object annotations in the response.
     */
    annotateParents?: boolean
    /**
     * Pagination cursor for retrieving the next page of results.
     */
    cursor?: string | null
    /**
     * Maximum number of results to return per page.
     */
    limit?: number
    /**
     * Start date for filtering events (inclusive). Replaces deprecated `since`.
     * Accepts a Date object or YYYY-MM-DD string.
     */
    dateFrom?: Date | string
    /**
     * End date for filtering events (inclusive). Replaces deprecated `until`.
     * Accepts a Date object or YYYY-MM-DD string.
     */
    dateTo?: Date | string
}

export type GetActivityLogsArgs = GetActivityLogsArgsCommon & {
    objectEventTypes?: ActivityObjectEventType | ActivityObjectEventType[]
    /** @removed Use `objectEventTypes` instead. */
    objectType?: never
    /** @removed Use `objectEventTypes` instead. */
    eventType?: never
    /** @removed Use `dateFrom` instead. */
    since?: never
    /** @removed Use `dateTo` instead. */
    until?: never
}

/**
 * Response from retrieving activity logs.
 */
export type GetActivityLogsResponse = {
    results: ActivityEvent[]
    nextCursor: string | null
}
