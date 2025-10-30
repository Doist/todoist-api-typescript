import { TodoistApi, type ActivityEvent } from '.'
import { DEFAULT_AUTH_TOKEN } from './test-utils/test-defaults'
import { getSyncBaseUri, ENDPOINT_REST_ACTIVITIES } from './consts/endpoints'
import { setupRestClientMock } from './test-utils/mocks'

function getTarget(baseUrl = 'https://api.todoist.com') {
    return new TodoistApi(DEFAULT_AUTH_TOKEN, baseUrl)
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
        test('calls get on restClient with expected parameters', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            await api.getActivityLogs()

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {},
            })
        })

        test('returns activity events from response', async () => {
            setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            const result = await api.getActivityLogs()

            expect(result.results).toHaveLength(2)
            expect(result.results[0].objectType).toBe('task') // Converted from 'item' to 'task'
            expect(result.results[0].eventType).toBe('added')
            expect(result.nextCursor).toBeNull()
        })

        test('handles pagination with cursor and limit', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: 'next_cursor_token',
            })
            const api = getTarget()

            const result = await api.getActivityLogs({
                cursor: 'prev_cursor',
                limit: 10,
            })

            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {
                    cursor: 'prev_cursor',
                    limit: 10,
                },
            })
            expect(result.nextCursor).toBe('next_cursor_token')
        })

        test('handles filter parameters', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            await api.getActivityLogs({
                objectType: 'item',
                eventType: 'completed',
                parentProjectId: '789',
            })

            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {
                    objectType: 'item',
                    eventType: 'completed',
                    parentProjectId: '789',
                },
            })
        })

        test('handles unknown event types and fields without crashing', async () => {
            setupRestClientMock({
                results: ACTIVITY_WITH_UNKNOWN_FIELDS,
                nextCursor: null,
            })
            const api = getTarget()

            const result = await api.getActivityLogs()

            expect(result.results).toHaveLength(1)
            expect(result.results[0].objectType).toBe('future_type')
            expect(result.results[0].eventType).toBe('new_event_type')
            expect(result.results[0].extraData).toEqual({
                future_field: 'some value',
                another_unknown: 123,
            })
        })

        test('converts Date objects to YYYY-MM-DD strings', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            const sinceDate = new Date('2025-01-15T10:30:00Z')
            const untilDate = new Date('2025-01-20T15:45:00Z')

            await api.getActivityLogs({
                since: sinceDate,
                until: untilDate,
            })

            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {
                    since: '2025-01-15',
                    until: '2025-01-20',
                },
            })
        })

        test('leaves string dates as-is for backward compatibility', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            await api.getActivityLogs({
                since: '2025-01-15',
                until: '2025-01-20',
            })

            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {
                    since: '2025-01-15',
                    until: '2025-01-20',
                },
            })
        })

        test('converts Date objects with correct timezone handling', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            // Test with a date that has time components
            const sinceDate = new Date(2025, 0, 15, 23, 59, 59) // January 15, 2025, 23:59:59 local time

            await api.getActivityLogs({
                since: sinceDate,
            })

            const expectedSince = `${sinceDate.getFullYear()}-01-15`

            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {
                    since: expectedSince,
                },
            })
        })

        test('converts modern objectType "task" to legacy "item" in API request', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            await api.getActivityLogs({
                objectType: 'task',
            })

            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {
                    objectType: 'item',
                },
            })
        })

        test('converts modern objectType "comment" to legacy "note" in API request', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            await api.getActivityLogs({
                objectType: 'comment',
            })

            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {
                    objectType: 'note',
                },
            })
        })

        test('leaves project objectType unchanged', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            await api.getActivityLogs({
                objectType: 'project',
            })

            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {
                    objectType: 'project',
                },
            })
        })

        test('converts legacy "item" to modern "task" in response', async () => {
            setupRestClientMock({
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
            })
            const api = getTarget()

            const result = await api.getActivityLogs()

            expect(result.results[0].objectType).toBe('task')
        })

        test('converts legacy "note" to modern "comment" in response', async () => {
            setupRestClientMock({
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
            })
            const api = getTarget()

            const result = await api.getActivityLogs()

            expect(result.results[0].objectType).toBe('comment')
        })

        test('leaves project objectType unchanged in response', async () => {
            setupRestClientMock({
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
            })
            const api = getTarget()

            const result = await api.getActivityLogs()

            expect(result.results[0].objectType).toBe('project')
        })

        test('supports backward compatibility with legacy "item" in request', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            await api.getActivityLogs({
                objectType: 'item',
            })

            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {
                    objectType: 'item',
                },
            })
        })

        test('supports backward compatibility with legacy "note" in request', async () => {
            const requestMock = setupRestClientMock({
                results: DEFAULT_ACTIVITY_RESPONSE,
                nextCursor: null,
            })
            const api = getTarget()

            await api.getActivityLogs({
                objectType: 'note',
            })

            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_ACTIVITIES,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: {
                    objectType: 'note',
                },
            })
        })
    })
})
