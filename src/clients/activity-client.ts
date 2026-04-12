import { ENDPOINT_REST_ACTIVITIES } from '../consts/endpoints'
import { request } from '../transport/http-client'
import type { GetActivityLogsArgs, GetActivityLogsResponse } from '../types/activity'
import {
    denormalizeObjectTypeFromApi,
    normalizeObjectEventTypeForApi,
} from '../utils/activity-helpers'
import { formatDateToYYYYMMDD } from '../utils/url-helpers'
import { validateActivityEventArray } from '../utils/validators'
import { BaseClient } from './base-client'

/**
 * Internal sub-client handling the activity-log endpoint.
 *
 * Instantiated by `TodoistApi`; the public `getActivityLogs` method on
 * `TodoistApi` delegates here. See `todoist-api.ts` for user-facing
 * JSDoc.
 */
export class ActivityClient extends BaseClient {
    async getActivityLogs(args: GetActivityLogsArgs = {}): Promise<GetActivityLogsResponse> {
        // Convert Date objects to YYYY-MM-DD strings
        const dateFrom =
            args.dateFrom instanceof Date ? formatDateToYYYYMMDD(args.dateFrom) : args.dateFrom
        const dateTo = args.dateTo instanceof Date ? formatDateToYYYYMMDD(args.dateTo) : args.dateTo

        // Destructure out raw date, filter-type, and removed legacy fields so they don't leak into payload
        const {
            dateFrom: _dateFrom,
            dateTo: _dateTo,
            objectEventTypes,
            objectType: _objectType,
            eventType: _eventType,
            since: _since,
            until: _until,
            ...rest
        } = args as GetActivityLogsArgs & Record<string, unknown>

        // Build normalized objectEventTypes for the API
        let normalizedObjectEventTypes: string[] | undefined
        if (objectEventTypes !== undefined) {
            const arr = Array.isArray(objectEventTypes) ? objectEventTypes : [objectEventTypes]
            normalizedObjectEventTypes = arr.map(normalizeObjectEventTypeForApi)
        }

        const processedArgs = {
            ...rest,
            ...(dateFrom !== undefined ? { dateFrom } : {}),
            ...(dateTo !== undefined ? { dateTo } : {}),
            ...(normalizedObjectEventTypes !== undefined
                ? { objectEventTypes: normalizedObjectEventTypes }
                : {}),
        }

        const {
            data: { results, nextCursor },
        } = await request<GetActivityLogsResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_ACTIVITIES,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: processedArgs as Record<string, unknown>,
        })

        // Convert legacy API object types back to modern SDK types
        const normalizedResults = results.map((event) => {
            const normalizedType = denormalizeObjectTypeFromApi(event.objectType)
            return {
                ...event,
                objectType: normalizedType || event.objectType,
            }
        }) as unknown[]

        return {
            results: validateActivityEventArray(normalizedResults),
            nextCursor,
        }
    }
}
