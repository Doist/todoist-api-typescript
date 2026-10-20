import { vi } from 'vitest'
import {
    ENDPOINT_REST_BACKUPS_DOWNLOAD,
    ENDPOINT_REST_TASKS,
    ENDPOINT_REST_UPLOADS,
    ENDPOINT_SYNC,
    getSyncBaseUri,
} from './consts/endpoints'
import { captureRequest, getLastRequest, http, HttpResponse, server } from './test-utils/msw-setup'
import { DEFAULT_AUTH_TOKEN, DEFAULT_TASK } from './test-utils/test-defaults'
import { TodoistApi } from './todoist-api'
import type { CustomFetchResponse } from './types/http'
import { snakeCaseKeys } from './utils/case-conversion'

const CUSTOM_HEADERS = { 'Doist-Platform': 'cli' }

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN, { headers: CUSTOM_HEADERS })
}

describe('TodoistApi headers option', () => {
    test('sends configured headers on sub-client REST requests', async () => {
        server.use(
            http.get(`${getSyncBaseUri()}${ENDPOINT_REST_TASKS}/123`, ({ request }) => {
                captureRequest({ request, body: undefined })
                return HttpResponse.json(DEFAULT_TASK, { status: 200 })
            }),
        )

        await getTarget().getTask('123')

        const capturedRequest = getLastRequest()
        expect(capturedRequest?.headers['doist-platform']).toBe('cli')
        expect(capturedRequest?.headers['authorization']).toBe(`Bearer ${DEFAULT_AUTH_TOKEN}`)
    })

    test('sends configured headers on Sync API requests', async () => {
        server.use(
            http.post(`${getSyncBaseUri()}${ENDPOINT_SYNC}`, ({ request }) => {
                captureRequest({ request, body: undefined })
                return HttpResponse.json({ sync_token: 'token123' }, { status: 200 })
            }),
        )
        const api = getTarget()

        await api.sync({ resourceTypes: ['items'], syncToken: '*' })
        expect(getLastRequest()?.headers['doist-platform']).toBe('cli')

        await api.getViewOptions()
        expect(getLastRequest()?.headers['doist-platform']).toBe('cli')
    })

    test('sends configured headers on multipart uploads', async () => {
        server.use(
            http.post(`${getSyncBaseUri()}${ENDPOINT_REST_UPLOADS}`, ({ request }) => {
                captureRequest({ request, body: undefined })
                return HttpResponse.json(
                    snakeCaseKeys({
                        fileUrl: 'https://files.todoist.com/uploads/test-file.pdf',
                        fileName: 'test-file.pdf',
                        fileSize: 1024,
                        fileType: 'application/pdf',
                        resourceType: 'file',
                        uploadState: 'completed',
                        image: null,
                        imageWidth: null,
                        imageHeight: null,
                    }),
                    { status: 200 },
                )
            }),
        )

        await getTarget().uploadFile({ file: Buffer.from('test'), fileName: 'test-file.pdf' })

        const capturedRequest = getLastRequest()
        expect(capturedRequest?.headers['doist-platform']).toBe('cli')
        expect(capturedRequest?.headers['content-type']).toMatch(/^multipart\/form-data/)
    })

    test('sends configured headers on backup downloads', async () => {
        server.use(
            http.get(`${getSyncBaseUri()}${ENDPOINT_REST_BACKUPS_DOWNLOAD}`, ({ request }) => {
                captureRequest({ request, body: undefined })
                return new HttpResponse('binary-content', { status: 200 })
            }),
        )

        await getTarget().downloadBackup({ file: 'backup123.zip' })

        const capturedRequest = getLastRequest()
        expect(capturedRequest?.headers['doist-platform']).toBe('cli')
        expect(capturedRequest?.headers['authorization']).toBe(`Bearer ${DEFAULT_AUTH_TOKEN}`)
    })

    test('sends configured headers on backup downloads through a custom fetch', async () => {
        const customFetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: {},
            text: () => Promise.resolve('binary-content'),
            json: () => Promise.resolve({}),
        } satisfies CustomFetchResponse)
        const api = new TodoistApi(DEFAULT_AUTH_TOKEN, { headers: CUSTOM_HEADERS, customFetch })

        await api.downloadBackup({ file: 'backup123.zip' })

        expect(customFetch).toHaveBeenCalledWith(
            expect.stringContaining(ENDPOINT_REST_BACKUPS_DOWNLOAD),
            expect.objectContaining({
                headers: { 'Doist-Platform': 'cli', Authorization: `Bearer ${DEFAULT_AUTH_TOKEN}` },
            }),
        )
    })

    test('does not send configured headers on attachment downloads', async () => {
        const fileUrl = 'https://files.todoist.com/user_upload/v2/123/file.png'
        server.use(
            http.get(fileUrl, ({ request }) => {
                captureRequest({ request, body: undefined })
                return new HttpResponse(new Uint8Array([137, 80, 78, 71]), { status: 200 })
            }),
        )

        await getTarget().viewAttachment(fileUrl)

        expect(getLastRequest()?.headers['doist-platform']).toBeUndefined()
    })

    test('cannot replace the Authorization header', async () => {
        server.use(
            http.get(`${getSyncBaseUri()}${ENDPOINT_REST_TASKS}/123`, ({ request }) => {
                captureRequest({ request, body: undefined })
                return HttpResponse.json(DEFAULT_TASK, { status: 200 })
            }),
        )
        const api = new TodoistApi(DEFAULT_AUTH_TOKEN, {
            headers: { ...CUSTOM_HEADERS, Authorization: 'Bearer forged' },
        })

        await api.getTask('123')

        expect(getLastRequest()?.headers['authorization']).toBe(`Bearer ${DEFAULT_AUTH_TOKEN}`)
    })

    describe('as a function', () => {
        function mockTaskEndpoint() {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_TASKS}/123`, ({ request }) => {
                    captureRequest({ request, body: undefined })
                    return HttpResponse.json(DEFAULT_TASK, { status: 200 })
                }),
            )
        }

        test('calls the function on every request', async () => {
            mockTaskEndpoint()
            let count = 0
            const api = new TodoistApi(DEFAULT_AUTH_TOKEN, {
                headers: () => ({ 'Request-Id': String(++count) }),
            })

            await api.getTask('123')
            expect(getLastRequest()?.headers['request-id']).toBe('1')

            await api.getTask('123')
            expect(getLastRequest()?.headers['request-id']).toBe('2')
        })

        test('calls the function for Sync, upload and backup requests', async () => {
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_SYNC}`, () =>
                    HttpResponse.json({ sync_token: 'token123' }, { status: 200 }),
                ),
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_UPLOADS}`, () =>
                    HttpResponse.json(
                        snakeCaseKeys({
                            fileUrl: 'https://files.todoist.com/uploads/test-file.pdf',
                            fileName: 'test-file.pdf',
                            fileSize: 1024,
                            fileType: 'application/pdf',
                            resourceType: 'file',
                            uploadState: 'completed',
                            image: null,
                            imageWidth: null,
                            imageHeight: null,
                        }),
                        { status: 200 },
                    ),
                ),
                http.get(
                    `${getSyncBaseUri()}${ENDPOINT_REST_BACKUPS_DOWNLOAD}`,
                    () => new HttpResponse('binary-content', { status: 200 }),
                ),
            )
            const headers = vi.fn(() => CUSTOM_HEADERS)
            const api = new TodoistApi(DEFAULT_AUTH_TOKEN, { headers })

            await api.sync({ resourceTypes: ['items'], syncToken: '*' })
            await api.getViewOptions()
            await api.uploadFile({ file: Buffer.from('test'), fileName: 'test-file.pdf' })
            await api.downloadBackup({ file: 'backup123.zip' })

            expect(headers).toHaveBeenCalledTimes(4)
        })

        test('reuses the result when a request is retried', async () => {
            const customFetch = vi
                .fn()
                .mockRejectedValueOnce(new TypeError('fetch failed'))
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    text: () => Promise.resolve(JSON.stringify(DEFAULT_TASK)),
                    json: () => Promise.resolve(DEFAULT_TASK),
                } satisfies CustomFetchResponse)
            let count = 0
            const headers = vi.fn(() => ({ 'Request-Id': String(++count) }))
            const api = new TodoistApi(DEFAULT_AUTH_TOKEN, { headers, customFetch })

            await api.getTask('123')

            expect(headers).toHaveBeenCalledTimes(1)
            expect(customFetch).toHaveBeenCalledTimes(2)
            for (const [, options] of customFetch.mock.calls) {
                expect(options.headers['Request-Id']).toBe('1')
            }
        })

        test('cannot replace the Authorization header', async () => {
            mockTaskEndpoint()
            const api = new TodoistApi(DEFAULT_AUTH_TOKEN, {
                headers: () => ({ authorization: 'Bearer forged' }),
            })

            await api.getTask('123')

            expect(getLastRequest()?.headers['authorization']).toBe(`Bearer ${DEFAULT_AUTH_TOKEN}`)
        })
    })
})
