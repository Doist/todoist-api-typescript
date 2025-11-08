import { TodoistApi } from '.'
import {
    COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL,
    COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT,
    COMMENT_WITH_OPTIONALS_AS_NULL_TASK,
    DEFAULT_AUTH_TOKEN,
    DEFAULT_COMMENT,
    DEFAULT_RAW_COMMENT,
    RAW_COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL,
    RAW_COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT,
    RAW_COMMENT_WITH_OPTIONALS_AS_NULL_TASK,
} from './test-utils/test-defaults'
import { getSyncBaseUri, ENDPOINT_REST_COMMENTS } from './consts/endpoints'
import { server, http, HttpResponse } from './test-utils/msw-setup'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi comment endpoints', () => {
    describe('getComments', () => {
        test('returns result from rest client', async () => {
            const mockResponses = [
                DEFAULT_RAW_COMMENT,
                RAW_COMMENT_WITH_OPTIONALS_AS_NULL_TASK,
                RAW_COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT,
                RAW_COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL,
            ]
            const expectedComments = [
                DEFAULT_COMMENT,
                COMMENT_WITH_OPTIONALS_AS_NULL_TASK,
                COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT,
                COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL,
            ]
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_COMMENTS}`, () => {
                    return HttpResponse.json(
                        { results: mockResponses, nextCursor: '123' },
                        { status: 200 },
                    )
                }),
            )
            const api = getTarget()

            const { results: comments, nextCursor } = await api.getComments({ taskId: '12' })

            expect(comments).toEqual(expectedComments)
            expect(nextCursor).toBe('123')
        })
    })

    describe('getComment', () => {
        test('returns result from rest client', async () => {
            server.use(
                http.get(`${getSyncBaseUri()}${ENDPOINT_REST_COMMENTS}/1`, () => {
                    return HttpResponse.json(DEFAULT_RAW_COMMENT, { status: 200 })
                }),
            )
            const api = getTarget()

            const comment = await api.getComment('1')

            expect(comment).toEqual(DEFAULT_COMMENT)
        })
    })

    describe('addComment', () => {
        const addCommentArgs = {
            content: 'A comment',
            taskId: '123',
        }

        test('returns result from rest client', async () => {
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_COMMENTS}`, () => {
                    return HttpResponse.json(DEFAULT_RAW_COMMENT, { status: 200 })
                }),
            )
            const api = getTarget()

            const comment = await api.addComment(addCommentArgs)

            expect(comment).toEqual(DEFAULT_COMMENT)
        })
    })

    describe('updateComment', () => {
        const updateCommentArgs = {
            content: 'Updated comment',
        }

        test('returns success result from rest client', async () => {
            const returnedComment = { ...DEFAULT_RAW_COMMENT, content: updateCommentArgs.content }
            const expectedComment = { ...DEFAULT_COMMENT, content: updateCommentArgs.content }
            server.use(
                http.post(`${getSyncBaseUri()}${ENDPOINT_REST_COMMENTS}/1`, () => {
                    return HttpResponse.json(returnedComment, { status: 200 })
                }),
            )
            const api = getTarget()

            const result = await api.updateComment('1', updateCommentArgs)

            expect(result).toEqual(expectedComment)
        })
    })

    describe('deleteComment', () => {
        test('returns success result from rest client', async () => {
            server.use(
                http.delete(`${getSyncBaseUri()}${ENDPOINT_REST_COMMENTS}/1`, () => {
                    return HttpResponse.json(undefined, { status: 204 })
                }),
            )
            const api = getTarget()

            const result = await api.deleteComment('1')

            expect(result).toEqual(true)
        })
    })
})
