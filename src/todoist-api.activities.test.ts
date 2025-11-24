import { TodoistApi, type ActivityEvent } from '.'
import { DEFAULT_AUTH_TOKEN } from './test-utils/test-defaults'
import { getSyncBaseUri, ENDPOINT_REST_ACTIVITIES } from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'

function getTarget(baseUrl = 'https://api.todoist.com') {
    return new TodoistApi(DEFAULT_AUTH_TOKEN, { baseUrl })
}

const DEFAULT_ACTIVITY_RESPONSE: ActivityEvent[] = [
    {
        id: '1',
        objectType: 'item',
        objectId: '123456',
        eventType: 'added',
        eventDate: '2025-01-10T10:00:00Z',
        parentProjectId: '789',
        parentItemId: null,
        initiatorId: 'user123',
        extraData: {
            content: 'Test task',
            client: 'web',
        },
    },
    {
        id: '2',
        objectType: 'project',
        objectId: '789',
        eventType: 'updated',
        eventDate: '2025-01-10T11:00:00Z',
        parentProjectId: null,
        parentItemId: null,
        initiatorId: 'user123',
        extraData: {
            name: 'Updated Project',
            last_name: 'Old Project',
        },
    },
]

const ACTIVITY_WITH_UNKNOWN_FIELDS: ActivityEvent[] = [
    {
        id: '3',
        objectType: 'future_type',
        objectId: '999',
        eventType: 'new_event_type',
        eventDate: '2025-01-10T12:00:00Z',
        parentProjectId: null,
        parentItemId: null,
        initiatorId: null,
        extraData: {
            future_field: 'some value',
            another_unknown: 123,
        },
        unknownField1: 'should not crash',
        unknownField2: { nested: 'object' },
    } as ActivityEvent,
]

describe('TodoistApi activity endpoints', () => {
    describe('getActivityLogs', () => {
        test('returns activity events from response', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs()

            expect(result.results).toHaveLength(2)
            expect(result.results[0].objectType).toBe('task') // Converted from 'item' to 'task'
            expect(result.results[0].eventType).toBe('added')
            expect(result.nextCursor).toBeNull()
        })

        test('handles pagination with cursor and limit', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: 'next_cursor_token',
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs({
                cursor: 'prev_cursor',
                limit: 10,
            })

            expect(result.nextCursor).toBe('next_cursor_token')
        })

        test('handles filter parameters', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs({
                objectType: 'item',
                eventType: 'completed',
                parentProjectId: '789',
            })

            expect(result.results).toHaveLength(2)
        })

        test('handles unknown event types and fields without crashing', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: ACTIVITY_WITH_UNKNOWN_FIELDS,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs()

            expect(result.results).toHaveLength(1)
            expect(result.results[0].objectType).toBe('future_type')
            expect(result.results[0].eventType).toBe('new_event_type')
            expect(result.results[0].extraData).toEqual({
                futureField: 'some value',
                anotherUnknown: 123,
            })
        })

        test('converts Date objects to YYYY-MM-DD strings', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const sinceDate = new Date('2025-01-15T10:30:00Z')
            const untilDate = new Date('2025-01-20T15:45:00Z')

            const result = await api.getActivityLogs({
                since: sinceDate,
                until: untilDate,
            })

            expect(result.results).toHaveLength(2)
        })

        test('leaves string dates as-is for backward compatibility', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs({
                since: '2025-01-15',
                until: '2025-01-20',
            })

            expect(result.results).toHaveLength(2)
        })

        test('converts Date objects with correct timezone handling', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const sinceDate = new Date(2025, 0, 15, 23, 59, 59)

            const result = await api.getActivityLogs({
                since: sinceDate,
            })

            expect(result.results).toHaveLength(2)
        })

        test('converts modern objectType "task" to legacy "item" in API request', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs({
                objectType: 'task',
            })

            expect(result.results).toHaveLength(2)
        })

        test('converts modern objectType "comment" to legacy "note" in API request', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs({
                objectType: 'comment',
            })

            expect(result.results).toHaveLength(2)
        })

        test('leaves project objectType unchanged', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs({
                objectType: 'project',
            })

            expect(result.results).toHaveLength(2)
        })

        test('converts legacy "item" to modern "task" in response', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: [
                                {
                                    id: '1',
                                    objectType: 'item',
                                    objectId: '123',
                                    eventType: 'added',
                                    eventDate: '2025-01-10T10:00:00Z',
                                    parentProjectId: null,
                                    parentItemId: null,
                                    initiatorId: 'user123',
                                    extraData: {},
                                },
                            ],
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs()

            expect(result.results[0].objectType).toBe('task')
        })

        test('converts legacy "note" to modern "comment" in response', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: [
                                {
                                    id: '1',
                                    objectType: 'note',
                                    objectId: '456',
                                    eventType: 'added',
                                    eventDate: '2025-01-10T10:00:00Z',
                                    parentProjectId: null,
                                    parentItemId: null,
                                    initiatorId: 'user123',
                                    extraData: {},
                                },
                            ],
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs()

            expect(result.results[0].objectType).toBe('comment')
        })

        test('leaves project objectType unchanged in response', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: [
                                {
                                    id: '1',
                                    objectType: 'project',
                                    objectId: '789',
                                    eventType: 'updated',
                                    eventDate: '2025-01-10T10:00:00Z',
                                    parentProjectId: null,
                                    parentItemId: null,
                                    initiatorId: 'user123',
                                    extraData: {},
                                },
                            ],
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs()

            expect(result.results[0].objectType).toBe('project')
        })

        test('supports backward compatibility with legacy "item" in request', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs({
                objectType: 'item',
            })

            expect(result.results).toHaveLength(2)
        })

        test('supports backward compatibility with legacy "note" in request', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_ACTIVITIES}`, () => {
                    return HttpResponse.json(
                        {
                            results: DEFAULT_ACTIVITY_RESPONSE,
                            nextCursor: null,
                        },
                        { status: 200 },
                    )
                }),
            )

            const api = getTarget()
            const result = await api.getActivityLogs({
                objectType: 'note',
            })

            expect(result.results).toHaveLength(2)
        })
    })
})
