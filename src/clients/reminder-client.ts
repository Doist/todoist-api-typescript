import { ENDPOINT_REST_LOCATION_REMINDERS, ENDPOINT_REST_REMINDERS } from '../consts/endpoints'
import { isSuccess, request } from '../transport/http-client'
import type { Reminder } from '../types'
import { TodoistArgumentError, TodoistRequestError } from '../types'
import type {
    AddLocationReminderArgs,
    AddReminderArgs,
    GetLocationRemindersArgs,
    GetLocationRemindersResponse,
    GetRemindersArgs,
    GetRemindersResponse,
    UpdateLocationReminderArgs,
    UpdateReminderArgs,
} from '../types/reminders'
import {
    ReminderIdSchema,
    UpdateLocationReminderArgsSchema,
    UpdateReminderArgsSchema,
} from '../types/reminders'
import { ReminderTypeEnum } from '../types/sync/resources/reminders'
import { generatePath } from '../utils/request-helpers'
import {
    validateLocationReminderArray,
    validateReminder,
    validateReminderArray,
} from '../utils/validators'
import { BaseClient } from './base-client'

/**
 * Internal sub-client handling all reminder-domain endpoints
 * (both time-based and location-based reminders).
 *
 * Instantiated by `TodoistApi`; every public reminder method on
 * `TodoistApi` delegates here. See `todoist-api.ts` for user-facing
 * JSDoc. The time-vs-location 404 translation is preserved here so a
 * caller who used the wrong endpoint gets a TodoistArgumentError
 * pointing at the correct method, rather than a bare 404.
 */
export class ReminderClient extends BaseClient {
    async getReminders(args: GetRemindersArgs = {}): Promise<GetRemindersResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetRemindersResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_REMINDERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })
        return {
            results: validateReminderArray(results),
            nextCursor,
        }
    }

    async getLocationReminders(
        args: GetLocationRemindersArgs = {},
    ): Promise<GetLocationRemindersResponse> {
        const {
            data: { results, nextCursor },
        } = await request<GetLocationRemindersResponse>({
            httpMethod: 'GET',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_LOCATION_REMINDERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
        })
        return {
            results: validateLocationReminderArray(results),
            nextCursor,
        }
    }

    async getReminder(id: string): Promise<Reminder> {
        ReminderIdSchema.parse(id)
        try {
            const response = await request<Reminder>({
                httpMethod: 'GET',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
            })

            return validateReminder(response.data)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Reminder ${id} was not found on the time-based reminder endpoint. If this is a location reminder, use getLocationReminder instead.`,
            )
        }
    }

    async getLocationReminder(id: string): Promise<Reminder> {
        ReminderIdSchema.parse(id)
        try {
            const response = await request<Reminder>({
                httpMethod: 'GET',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_LOCATION_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
            })

            return validateReminder(response.data)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Location reminder ${id} was not found on the location reminder endpoint. If this is a time-based reminder, use getReminder instead.`,
            )
        }
    }

    async addReminder(args: AddReminderArgs, requestId?: string): Promise<Reminder> {
        const response = await request<Reminder>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_REMINDERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: args,
            requestId: requestId,
        })

        return validateReminder(response.data)
    }

    async addLocationReminder(
        args: AddLocationReminderArgs,
        requestId?: string,
    ): Promise<Reminder> {
        const response = await request<Reminder>({
            httpMethod: 'POST',
            baseUri: this.syncApiBase,
            relativePath: ENDPOINT_REST_LOCATION_REMINDERS,
            apiToken: this.authToken,
            customFetch: this.customFetch,
            payload: {
                ...args,
                reminderType: ReminderTypeEnum.Location,
            },
            requestId: requestId,
        })

        return validateReminder(response.data)
    }

    async updateReminder(
        id: string,
        args: UpdateReminderArgs,
        requestId?: string,
    ): Promise<Reminder> {
        ReminderIdSchema.parse(id)
        const payload = UpdateReminderArgsSchema.parse(args)
        try {
            const response = await request<Reminder>({
                httpMethod: 'POST',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
                payload,
                requestId: requestId,
            })

            return validateReminder(response.data)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Reminder ${id} was not found on the time-based reminder endpoint. If this is a location reminder, use updateLocationReminder instead.`,
            )
        }
    }

    async updateLocationReminder(
        id: string,
        args: UpdateLocationReminderArgs,
        requestId?: string,
    ): Promise<Reminder> {
        ReminderIdSchema.parse(id)
        const payload = UpdateLocationReminderArgsSchema.parse(args)
        try {
            const response = await request<Reminder>({
                httpMethod: 'POST',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_LOCATION_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
                payload,
                requestId: requestId,
            })

            return validateReminder(response.data)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Location reminder ${id} was not found on the location reminder endpoint. If this is a time-based reminder, use updateReminder instead.`,
            )
        }
    }

    async deleteReminder(id: string, requestId?: string): Promise<boolean> {
        ReminderIdSchema.parse(id)
        try {
            const response = await request({
                httpMethod: 'DELETE',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
                requestId: requestId,
            })
            return isSuccess(response)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Reminder ${id} was not found on the time-based reminder endpoint. If this is a location reminder, use deleteLocationReminder instead.`,
            )
        }
    }

    async deleteLocationReminder(id: string, requestId?: string): Promise<boolean> {
        ReminderIdSchema.parse(id)
        try {
            const response = await request({
                httpMethod: 'DELETE',
                baseUri: this.syncApiBase,
                relativePath: generatePath(ENDPOINT_REST_LOCATION_REMINDERS, id),
                apiToken: this.authToken,
                customFetch: this.customFetch,
                requestId: requestId,
            })
            return isSuccess(response)
        } catch (error) {
            if (!(error instanceof TodoistRequestError) || error.httpStatusCode !== 404) {
                throw error
            }

            throw new TodoistArgumentError(
                `Location reminder ${id} was not found on the location reminder endpoint. If this is a time-based reminder, use deleteReminder instead.`,
            )
        }
    }
}
