import { TodoistApi } from '.'
import {
    DEFAULT_ABSOLUTE_REMINDER,
    DEFAULT_AUTH_TOKEN,
    DEFAULT_LOCATION_REMINDER,
    DEFAULT_RELATIVE_REMINDER,
    DEFAULT_REMINDER_ID,
    DEFAULT_REQUEST_ID,
    DEFAULT_TASK_ID,
} from './test-utils/test-defaults'
import {
    ENDPOINT_REST_LOCATION_REMINDERS,
    ENDPOINT_REST_REMINDERS,
    getSyncBaseUri,
} from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'
import { TodoistArgumentError } from './types'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi reminder endpoints', () => {
    describe('getReminder', () => {
        test('returns result from rest client', async () => {
            server.use(
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json(DEFAULT_ABSOLUTE_REMINDER, { status: 200 }),
                ),
            )
            const api = getTarget()

            const reminder = await api.getReminder(DEFAULT_REMINDER_ID)

            expect(reminder).toEqual(DEFAULT_ABSOLUTE_REMINDER)
        })

        test('falls back to location reminder endpoint', async () => {
            server.use(
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json({ error: 'Reminder not found' }, { status: 404 }),
                ),
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_LOCATION_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json(DEFAULT_LOCATION_REMINDER, { status: 200 }),
                ),
            )
            const api = getTarget()

            const reminder = await api.getReminder(DEFAULT_REMINDER_ID)

            expect(reminder).toEqual(DEFAULT_LOCATION_REMINDER)
        })
    })

    describe('addReminder', () => {
        test('creates a relative reminder', async () => {
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}`, async ({ request }) => {
                    const body = (await request.json()) as Record<string, unknown>
                    expect(body).toEqual({
                        task_id: DEFAULT_TASK_ID,
                        minute_offset: 30,
                        service: 'push',
                        is_urgent: true,
                    })
                    return HttpResponse.json(DEFAULT_RELATIVE_REMINDER, { status: 200 })
                }),
            )
            const api = getTarget()

            const reminder = await api.addReminder(
                {
                    taskId: DEFAULT_TASK_ID,
                    minuteOffset: 30,
                    service: 'push',
                    isUrgent: true,
                },
                DEFAULT_REQUEST_ID,
            )

            expect(reminder).toEqual(DEFAULT_RELATIVE_REMINDER)
        })

        test('creates an absolute reminder', async () => {
            const due = {
                date: '2026-03-25T09:00:00Z',
                timezone: 'UTC',
            }

            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}`, async ({ request }) => {
                    const body = (await request.json()) as Record<string, unknown>
                    expect(body).toEqual({
                        task_id: DEFAULT_TASK_ID,
                        reminder_type: 'absolute',
                        due: {
                            date: '2026-03-25T09:00:00Z',
                            timezone: 'UTC',
                        },
                        service: 'email',
                    })
                    return HttpResponse.json(DEFAULT_ABSOLUTE_REMINDER, { status: 200 })
                }),
            )
            const api = getTarget()

            const reminder = await api.addReminder({
                taskId: DEFAULT_TASK_ID,
                reminderType: 'absolute',
                due,
                service: 'email',
            })

            expect(reminder).toEqual(DEFAULT_ABSOLUTE_REMINDER)
        })

        test('creates a location reminder', async () => {
            server.use(
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_LOCATION_REMINDERS}`,
                    async ({ request }) => {
                        const body = (await request.json()) as Record<string, unknown>
                        expect(body).toEqual({
                            task_id: DEFAULT_TASK_ID,
                            reminder_type: 'location',
                            name: 'Aliados',
                            loc_lat: '41.148581',
                            loc_long: '-8.610945000000015',
                            loc_trigger: 'on_enter',
                            radius: 100,
                        })
                        return HttpResponse.json(DEFAULT_LOCATION_REMINDER, { status: 200 })
                    },
                ),
            )
            const api = getTarget()

            const reminder = await api.addReminder({
                taskId: DEFAULT_TASK_ID,
                reminderType: 'location',
                name: 'Aliados',
                locLat: '41.148581',
                locLong: '-8.610945000000015',
                locTrigger: 'on_enter',
                radius: 100,
            })

            expect(reminder).toEqual(DEFAULT_LOCATION_REMINDER)
        })
    })

    describe('updateReminder', () => {
        test('updates a relative reminder', async () => {
            server.use(
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json(DEFAULT_RELATIVE_REMINDER, { status: 200 }),
                ),
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    async ({ request }) => {
                        const body = (await request.json()) as Record<string, unknown>
                        expect(body).toEqual({
                            minute_offset: 15,
                            service: 'email',
                            is_urgent: false,
                        })
                        return HttpResponse.json(
                            { ...DEFAULT_RELATIVE_REMINDER, minuteOffset: 15 },
                            { status: 200 },
                        )
                    },
                ),
            )
            const api = getTarget()

            const reminder = await api.updateReminder(DEFAULT_REMINDER_ID, {
                minuteOffset: 15,
                service: 'email',
                isUrgent: false,
            })

            expect(reminder).toEqual({ ...DEFAULT_RELATIVE_REMINDER, minuteOffset: 15 })
        })

        test('updates a location reminder', async () => {
            server.use(
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json({ error: 'Reminder not found' }, { status: 404 }),
                ),
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_LOCATION_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json(DEFAULT_LOCATION_REMINDER, { status: 200 }),
                ),
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_LOCATION_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    async ({ request }) => {
                        const body = (await request.json()) as Record<string, unknown>
                        expect(body).toEqual({
                            reminder_type: 'location',
                            name: 'Office',
                            loc_trigger: 'on_leave',
                        })
                        return HttpResponse.json(
                            {
                                ...DEFAULT_LOCATION_REMINDER,
                                name: 'Office',
                                locTrigger: 'on_leave',
                            },
                            { status: 200 },
                        )
                    },
                ),
            )
            const api = getTarget()

            const reminder = await api.updateReminder(DEFAULT_REMINDER_ID, {
                reminderType: 'location',
                name: 'Office',
                locTrigger: 'on_leave',
            })

            expect(reminder).toEqual({
                ...DEFAULT_LOCATION_REMINDER,
                name: 'Office',
                locTrigger: 'on_leave',
            })
        })

        test('updates shared fields on a location reminder', async () => {
            server.use(
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json({ error: 'Reminder not found' }, { status: 404 }),
                ),
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_LOCATION_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json(DEFAULT_LOCATION_REMINDER, { status: 200 }),
                ),
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_LOCATION_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    async ({ request }) => {
                        const body = (await request.json()) as Record<string, unknown>
                        expect(body).toEqual({
                            notify_uid: 'user-123',
                        })
                        return HttpResponse.json(
                            {
                                ...DEFAULT_LOCATION_REMINDER,
                                notifyUid: 'user-123',
                            },
                            { status: 200 },
                        )
                    },
                ),
            )
            const api = getTarget()

            const reminder = await api.updateReminder(DEFAULT_REMINDER_ID, {
                notifyUid: 'user-123',
            })

            expect(reminder).toEqual({
                ...DEFAULT_LOCATION_REMINDER,
                notifyUid: 'user-123',
            })
        })

        test('rejects changing a time-based reminder to location', async () => {
            let postCalled = false

            server.use(
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json(DEFAULT_ABSOLUTE_REMINDER, { status: 200 }),
                ),
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => {
                        postCalled = true
                        return HttpResponse.json(DEFAULT_ABSOLUTE_REMINDER, { status: 200 })
                    },
                ),
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_LOCATION_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => {
                        postCalled = true
                        return HttpResponse.json(DEFAULT_LOCATION_REMINDER, { status: 200 })
                    },
                ),
            )
            const api = getTarget()

            await expect(
                api.updateReminder(DEFAULT_REMINDER_ID, {
                    reminderType: 'location',
                    name: 'Office',
                    locLat: '41.148581',
                    locLong: '-8.610945000000015',
                    locTrigger: 'on_enter',
                }),
            ).rejects.toThrow(TodoistArgumentError)
            expect(postCalled).toBe(false)
        })

        test('rejects changing a location reminder to time-based', async () => {
            let postCalled = false

            server.use(
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json({ error: 'Reminder not found' }, { status: 404 }),
                ),
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_LOCATION_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json(DEFAULT_LOCATION_REMINDER, { status: 200 }),
                ),
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => {
                        postCalled = true
                        return HttpResponse.json(DEFAULT_ABSOLUTE_REMINDER, { status: 200 })
                    },
                ),
                http.post(
                    `${getSyncBaseUri()}${ENDPOINT_REST_LOCATION_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => {
                        postCalled = true
                        return HttpResponse.json(DEFAULT_LOCATION_REMINDER, { status: 200 })
                    },
                ),
            )
            const api = getTarget()

            await expect(
                api.updateReminder(DEFAULT_REMINDER_ID, {
                    reminderType: 'absolute',
                    due: {
                        date: '2026-03-25T09:00:00Z',
                        timezone: 'UTC',
                    },
                }),
            ).rejects.toThrow(TodoistArgumentError)
            expect(postCalled).toBe(false)
        })
    })

    describe('deleteReminder', () => {
        test('returns success result from rest client', async () => {
            server.use(
                http.delete(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json(undefined, { status: 204 }),
                ),
            )
            const api = getTarget()

            const result = await api.deleteReminder(DEFAULT_REMINDER_ID)

            expect(result).toBe(true)
        })

        test('falls back to location reminder endpoint', async () => {
            server.use(
                http.delete(
                    `${getSyncBaseUri()}${ENDPOINT_REST_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json({ error: 'Reminder not found' }, { status: 404 }),
                ),
                http.delete(
                    `${getSyncBaseUri()}${ENDPOINT_REST_LOCATION_REMINDERS}/${DEFAULT_REMINDER_ID}`,
                    () => HttpResponse.json(undefined, { status: 204 }),
                ),
            )
            const api = getTarget()

            const result = await api.deleteReminder(DEFAULT_REMINDER_ID)

            expect(result).toBe(true)
        })
    })
})
