import { TodoistApi } from '.'
import {
    COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL,
    COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT,
    COMMENT_WITH_OPTIONALS_AS_NULL_TASK,
    DEFAULT_AUTH_TOKEN,
    DEFAULT_COMMENT,
    DEFAULT_REQUEST_ID,
} from './testUtils/testDefaults'
import { getSyncBaseUri, ENDPOINT_REST_COMMENTS } from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi comment endpoints', () => {
    describe('getComments', () => {
        test('calls get request with expected params', async () => {
            const getCommentsArgs = { projectId: '12', limit: 10, cursor: '0' }
            const requestMock = setupRestClientMock({
                results: [DEFAULT_COMMENT],
                nextCursor: '123',
            })
            const api = getTarget()

            await api.getComments(getCommentsArgs)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                getSyncBaseUri(),
                ENDPOINT_REST_COMMENTS,
                DEFAULT_AUTH_TOKEN,
                getCommentsArgs,
            )
        })

        test('returns result from rest client', async () => {
            const expectedComments = [
                DEFAULT_COMMENT,
                COMMENT_WITH_OPTIONALS_AS_NULL_TASK,
                COMMENT_WITH_OPTIONALS_AS_NULL_PROJECT,
                COMMENT_WITH_ATTACHMENT_WITH_OPTIONALS_AS_NULL,
            ]
            setupRestClientMock({ results: expectedComments, nextCursor: '123' })
            const api = getTarget()

            const { results: comments, nextCursor } = await api.getComments({ taskId: '12' })

            expect(comments).toEqual(expectedComments)
            expect(nextCursor).toBe('123')
        })
    })

    describe('getComment', () => {
        test('calls get on expected url', async () => {
            const commentId = '1'
            const requestMock = setupRestClientMock(DEFAULT_COMMENT)
            const api = getTarget()

            await api.getComment(commentId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                getSyncBaseUri(),
                `${ENDPOINT_REST_COMMENTS}/${commentId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            const expectedComment = DEFAULT_COMMENT
            setupRestClientMock(expectedComment)
            const api = getTarget()

            const comment = await api.getComment('1')

            expect(comment).toEqual(expectedComment)
        })
    })

    describe('addComment', () => {
        const addCommentArgs = {
            content: 'A comment',
            taskId: '123',
        }

        test('makes post request with expected params', async () => {
            const requestMock = setupRestClientMock(DEFAULT_COMMENT)
            const api = getTarget()

            await api.addComment(addCommentArgs, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getSyncBaseUri(),
                ENDPOINT_REST_COMMENTS,
                DEFAULT_AUTH_TOKEN,
                addCommentArgs,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns result from rest client', async () => {
            const expectedComment = DEFAULT_COMMENT
            setupRestClientMock(expectedComment)
            const api = getTarget()

            const comment = await api.addComment(addCommentArgs)

            expect(comment).toEqual(expectedComment)
        })
    })

    describe('updateComment', () => {
        const updateCommentArgs = {
            content: 'Updated comment',
        }

        test('makes post request with expected params', async () => {
            const taskId = '1'
            const requestMock = setupRestClientMock(DEFAULT_COMMENT, 204)
            const api = getTarget()

            await api.updateComment(taskId, updateCommentArgs, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                getSyncBaseUri(),
                `${ENDPOINT_REST_COMMENTS}/${taskId}`,
                DEFAULT_AUTH_TOKEN,
                updateCommentArgs,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            const returnedComment = { ...DEFAULT_COMMENT, ...updateCommentArgs }
            setupRestClientMock(returnedComment, 204)
            const api = getTarget()

            const result = await api.updateComment('1', updateCommentArgs)

            expect(result).toEqual(returnedComment)
        })
    })

    describe('deleteComment', () => {
        test('makes delete request on expected url', async () => {
            const taskId = '1'
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.deleteComment(taskId, DEFAULT_REQUEST_ID)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'DELETE',
                getSyncBaseUri(),
                `${ENDPOINT_REST_COMMENTS}/${taskId}`,
                DEFAULT_AUTH_TOKEN,
                undefined,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const result = await api.deleteComment('1')

            expect(result).toEqual(true)
        })
    })
})
