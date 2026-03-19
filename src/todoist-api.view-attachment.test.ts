import { TodoistApi } from './todoist-api'
import { server, http, HttpResponse, getLastRequest, captureRequest } from './test-utils/msw-setup'
import type { Comment } from './types/entities'

const FILE_URL = 'https://files.todoist.com/user_upload/v2/123/file.png'

function createMockComment(overrides: Partial<Comment> = {}): Comment {
    return {
        id: 'comment-1',
        content: 'Check this out',
        postedAt: '2024-01-01T00:00:00Z',
        postedUid: 'user-1',
        taskId: 'task-1',
        projectId: undefined,
        uidsToNotify: null,
        reactions: null,
        isDeleted: false,
        fileAttachment: {
            resourceType: 'file',
            fileName: 'file.png',
            fileSize: 1024,
            fileType: 'image/png',
            fileUrl: FILE_URL,
            fileDuration: null,
            uploadState: 'completed',
            image: null,
            imageWidth: null,
            imageHeight: null,
            url: null,
            title: null,
        },
        ...overrides,
    }
}

describe('TodoistApi viewAttachment', () => {
    describe('with a URL string', () => {
        test('fetches attachment with authorization header', async () => {
            const imageData = new Uint8Array([137, 80, 78, 71])
            server.use(
                http.get(FILE_URL, async ({ request }) => {
                    captureRequest({ request, body: null })
                    return new HttpResponse(imageData, {
                        status: 200,
                        headers: { 'Content-Type': 'image/png' },
                    })
                }),
            )

            const api = new TodoistApi('test-token')
            const response = await api.viewAttachment(FILE_URL)

            const capturedRequest = getLastRequest()
            expect(capturedRequest).toBeDefined()
            expect(capturedRequest?.headers['authorization']).toBe('Bearer test-token')
            expect(response.ok).toBe(true)
            expect(response.headers.get('content-type')).toBe('image/png')
        })

        test('returns response that can be read as ArrayBuffer', async () => {
            const imageData = new Uint8Array([137, 80, 78, 71])
            server.use(
                http.get(FILE_URL, () => {
                    return new HttpResponse(imageData, {
                        status: 200,
                        headers: { 'Content-Type': 'image/png' },
                    })
                }),
            )

            const api = new TodoistApi('test-token')
            const response = await api.viewAttachment(FILE_URL)
            const buffer = await response.arrayBuffer()

            expect(new Uint8Array(buffer)).toEqual(imageData)
        })

        test('returns response that can be read as text', async () => {
            const textContent = 'Hello, world!'
            server.use(
                http.get(FILE_URL, () => {
                    return new HttpResponse(textContent, {
                        status: 200,
                        headers: { 'Content-Type': 'text/plain' },
                    })
                }),
            )

            const api = new TodoistApi('test-token')
            const response = await api.viewAttachment(FILE_URL)
            const text = await response.text()

            expect(text).toBe(textContent)
        })
    })

    describe('with a Comment object', () => {
        test('extracts fileUrl from comment attachment', async () => {
            server.use(
                http.get(FILE_URL, async ({ request }) => {
                    captureRequest({ request, body: null })
                    return new HttpResponse('data', { status: 200 })
                }),
            )

            const api = new TodoistApi('test-token')
            const comment = createMockComment()
            const response = await api.viewAttachment(comment)

            const capturedRequest = getLastRequest()
            expect(capturedRequest?.url).toBe(FILE_URL)
            expect(response.ok).toBe(true)
        })

        test('throws when comment has no file attachment', async () => {
            const api = new TodoistApi('test-token')
            const comment = createMockComment({ fileAttachment: null })

            await expect(api.viewAttachment(comment)).rejects.toThrow(
                'Comment does not have a file attachment',
            )
        })

        test('throws when comment attachment has no fileUrl', async () => {
            const api = new TodoistApi('test-token')
            const comment = createMockComment({
                fileAttachment: {
                    resourceType: 'file',
                    fileName: 'file.png',
                    fileUrl: null,
                },
            })

            await expect(api.viewAttachment(comment)).rejects.toThrow(
                'Comment does not have a file attachment',
            )
        })
    })

    describe('error handling', () => {
        test('throws on 404 response', async () => {
            server.use(
                http.get(FILE_URL, () => {
                    return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
                }),
            )

            const api = new TodoistApi('test-token')

            await expect(api.viewAttachment(FILE_URL)).rejects.toThrow(
                'Failed to fetch attachment: 404 Not Found',
            )
        })

        test('throws on 403 response', async () => {
            server.use(
                http.get(FILE_URL, () => {
                    return new HttpResponse(null, { status: 403, statusText: 'Forbidden' })
                }),
            )

            const api = new TodoistApi('test-token')

            await expect(api.viewAttachment(FILE_URL)).rejects.toThrow(
                'Failed to fetch attachment: 403 Forbidden',
            )
        })
    })
})
