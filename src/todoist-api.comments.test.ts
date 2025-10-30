import { TodoistApi } from '.'
import {
    COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL,
    COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT,
    COMMENT_WITH_OPTIONALS_AS_NULL_TASK,
    DEFAULT_AUTH_TOKEN,
    DEFAULT_COMMENT,
    DEFAULT_RAW_COMMENT,
    DEFAULT_REQUEST_ID,
    RAW_COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL,
    RAW_COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT,
    RAW_COMMENT_WITH_OPTIONALS_AS_NULL_TASK,
} from './test-utils/test-defaults'
import { getSyncBaseUri, ENDPOINT_REST_COMMENTS } from './consts/endpoints'
import { setupRestClientMock } from './test-utils/mocks'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi comment endpoints', () => {
    describe('getComments', () => {
        test('calls get request with expected params', async () => {
            const getCommentsArgs = { projectId: '12', limit: 10, cursor: '0' }
            const requestMock = setupRestClientMock({
                results: [DEFAULT_RAW_COMMENT],
                nextCursor: '123',
            })
            const api = getTarget()

            await api.getComments(getCommentsArgs)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_COMMENTS,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: getCommentsArgs,
            })
        })

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
            setupRestClientMock({ results: mockResponses, nextCursor: '123' })
            const api = getTarget()

            const { results: comments, nextCursor } = await api.getComments({ taskId: '12' })

            expect(comments).toEqual(expectedComments)
            expect(nextCursor).toBe('123')
        })
    })

    describe('getComment', () => {
        test('calls get on expected url', async () => {
            const commentId = '1'
            const requestMock = setupRestClientMock(DEFAULT_RAW_COMMENT)
            const api = getTarget()

            await api.getComment(commentId)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'GET',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_COMMENTS}/${commentId}`,
                apiToken: DEFAULT_AUTH_TOKEN,
            })
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_RAW_COMMENT)
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

        test('makes post request with expected params', async () => {
            const requestMock = setupRestClientMock(DEFAULT_RAW_COMMENT)
            const api = getTarget()

            await api.addComment(addCommentArgs, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri(),
                relativePath: ENDPOINT_REST_COMMENTS,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: addCommentArgs,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_RAW_COMMENT)
            const api = getTarget()

            const comment = await api.addComment(addCommentArgs)

            expect(comment).toEqual(DEFAULT_COMMENT)
        })
    })

    describe('updateComment', () => {
        const updateCommentArgs = {
            content: 'Updated comment',
        }

        test('makes post request with expected params', async () => {
            const taskId = '1'
            const requestMock = setupRestClientMock(DEFAULT_RAW_COMMENT, 204)
            const api = getTarget()

            await api.updateComment(taskId, updateCommentArgs, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'POST',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_COMMENTS}/${taskId}`,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: updateCommentArgs,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns success result from rest client', async () => {
            const returnedComment = { ...DEFAULT_RAW_COMMENT, content: updateCommentArgs.content }
            const expectedComment = { ...DEFAULT_COMMENT, content: updateCommentArgs.content }
            setupRestClientMock(returnedComment, 204)
            const api = getTarget()

            const result = await api.updateComment('1', updateCommentArgs)

            expect(result).toEqual(expectedComment)
        })
    })

    describe('deleteComment', () => {
        test('makes delete request on expected url', async () => {
            const taskId = '1'
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.deleteComment(taskId, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'DELETE',
                baseUri: getSyncBaseUri(),
                relativePath: `${ENDPOINT_REST_COMMENTS}/${taskId}`,
                apiToken: DEFAULT_AUTH_TOKEN,
                payload: undefined,
                requestId: DEFAULT_REQUEST_ID,
            })
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const result = await api.deleteComment('1')

            expect(result).toEqual(true)
        })
    })
})
