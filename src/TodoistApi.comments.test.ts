import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_COMMENT } from './testUtils/testDefaults'
import { API_REST_BASE_URI, ENDPOINT_REST_COMMENTS } from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi comment endpoints', () => {
    describe('getComments', () => {
        test('calls get request with expected params', async () => {
            const getCommentsArgs = { projectId: 12 }
            const requestMock = setupRestClientMock([DEFAULT_COMMENT])
            const api = getTarget()

            await api.getComments(getCommentsArgs)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                API_REST_BASE_URI,
                ENDPOINT_REST_COMMENTS,
                DEFAULT_AUTH_TOKEN,
                getCommentsArgs,
            )
        })

        test('returns result from rest client', async () => {
            const expectedComments = [DEFAULT_COMMENT]
            setupRestClientMock(expectedComments)
            const api = getTarget()

            const comments = await api.getComments({ taskId: 12 })

            expect(comments).toEqual(expectedComments)
        })
    })

    describe('getComment', () => {
        test('calls get on expected url', async () => {
            const commentId = 1
            const requestMock = setupRestClientMock(DEFAULT_COMMENT)
            const api = getTarget()

            await api.getComment(commentId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_COMMENTS}/${commentId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            const expectedComment = DEFAULT_COMMENT
            setupRestClientMock(expectedComment)
            const api = getTarget()

            const comment = await api.getComment(1)

            expect(comment).toEqual(expectedComment)
        })
    })

    describe('addComment', () => {
        const addCommentArgs = {
            content: 'A comment',
            taskId: 123,
        }

        test('makes post request with expected params', async () => {
            const requestMock = setupRestClientMock(DEFAULT_COMMENT)
            const api = getTarget()

            await api.addComment(addCommentArgs)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_REST_BASE_URI,
                ENDPOINT_REST_COMMENTS,
                DEFAULT_AUTH_TOKEN,
                addCommentArgs,
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
            const taskId = 1
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.updateComment(taskId, updateCommentArgs)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_COMMENTS}/${taskId}`,
                DEFAULT_AUTH_TOKEN,
                updateCommentArgs,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const result = await api.updateComment(1, updateCommentArgs)

            expect(result).toEqual(true)
        })
    })

    describe('deleteComment', () => {
        test('makes delete request on expected url', async () => {
            const taskId = 1
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.deleteComment(taskId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'DELETE',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_COMMENTS}/${taskId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const result = await api.deleteComment(1)

            expect(result).toEqual(true)
        })
    })
})
