import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_LABEL, DEFAULT_REQUEST_ID } from './testUtils/testDefaults'
import {
    getSyncBaseUri,
    ENDPOINT_REST_LABELS,
    ENDPOINT_REST_LABELS_SHARED,
    ENDPOINT_REST_LABELS_SHARED_RENAME,
    ENDPOINT_REST_LABELS_SHARED_REMOVE,
} from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi label endpoints', () => {
    describe('getLabel', () => {
        test('calls get request with expected url', async () => {
            const labelId = '12'
            const requestMock = setupRestClientMock(DEFAULT_LABEL)
            const api = getTarget()

            await api.getLabel(labelId)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                `${ENDPOINT_REST_LABELS}/${labelId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_LABEL)
            const api = getTarget()

            const label = await api.getLabel('123')

            expect(label).toEqual(DEFAULT_LABEL)
        })
    })

    describe('getLabels', () => {
        test('calls get on labels endpoint', async () => {
            const requestMock = setupRestClientMock({
                results: [DEFAULT_LABEL],
                nextCursor: '123',
            })
            const api = getTarget()

            await api.getLabels({ limit: 10, cursor: '0' })

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                ENDPOINT_REST_LABELS,
                DEFAULT_AUTH_TOKEN,
                {
                    limit: 10,
                    cursor: '0',
                },
            )
        })

        test('returns result from rest client', async () => {
            const labels = [DEFAULT_LABEL]
            setupRestClientMock({
                results: [DEFAULT_LABEL],
                nextCursor: '123',
            })
            const api = getTarget()

            const { results, nextCursor } = await api.getLabels()

            expect(results).toEqual(labels)
            expect(nextCursor).toBe('123')
        })
    })

    describe('addLabel', () => {
        const DEFAULT_ADD_LABEL_ARGS = {
            name: 'This is a label',
        }

        test('calls post on restClient with expected parameters', async () => {
            const requestMock = setupRestClientMock(DEFAULT_LABEL)
            const api = getTarget()

            await api.addLabel(DEFAULT_ADD_LABEL_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'POST',
                getSyncBaseUri(),
                ENDPOINT_REST_LABELS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_ADD_LABEL_ARGS,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_LABEL)
            const api = getTarget()

            const label = await api.addLabel(DEFAULT_ADD_LABEL_ARGS)

            expect(label).toEqual(DEFAULT_LABEL)
        })
    })

    describe('updateLabel', () => {
        const DEFAULT_UPDATE_LABEL_ARGS = {
            name: 'A new name',
        }

        test('calls post on restClient with expected parameters', async () => {
            const labelId = '123'
            const requestMock = setupRestClientMock(DEFAULT_LABEL, 204)
            const api = getTarget()

            await api.updateLabel(labelId, DEFAULT_UPDATE_LABEL_ARGS, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'POST',
                getSyncBaseUri(),
                `${ENDPOINT_REST_LABELS}/${labelId}`,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_UPDATE_LABEL_ARGS,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            const returnedTask = { ...DEFAULT_LABEL, ...DEFAULT_UPDATE_LABEL_ARGS }
            setupRestClientMock(returnedTask, 204)
            const api = getTarget()

            const result = await api.updateLabel('123', DEFAULT_UPDATE_LABEL_ARGS)

            expect(result).toEqual(returnedTask)
        })
    })

    describe('deleteLabel', () => {
        test('calls delete on expected label', async () => {
            const labelId = '123'
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.deleteLabel(labelId, DEFAULT_REQUEST_ID)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'DELETE',
                getSyncBaseUri(),
                `${ENDPOINT_REST_LABELS}/${labelId}`,
                DEFAULT_AUTH_TOKEN,
                undefined,
                DEFAULT_REQUEST_ID,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const result = await api.deleteLabel('123')

            expect(result).toEqual(true)
        })
    })

    describe('getSharedLabels', () => {
        test('calls getSharedLabels with expected parameters', async () => {
            const mockResponse = { results: ['shared1', 'shared2'], nextCursor: 'abc' }
            const requestMock = setupRestClientMock(mockResponse)
            const api = getTarget()

            await api.getSharedLabels({
                omitPersonal: true,
                limit: 10,
                cursor: 'abc',
            })

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'GET',
                getSyncBaseUri(),
                ENDPOINT_REST_LABELS_SHARED,
                DEFAULT_AUTH_TOKEN,
                { omitPersonal: true, limit: 10, cursor: 'abc' },
            )
        })

        test('returns result from rest client', async () => {
            const mockResponse = { results: ['shared1', 'shared2'], nextCursor: 'abc' }
            setupRestClientMock(mockResponse)
            const api = getTarget()

            const result = await api.getSharedLabels()

            expect(result).toEqual(mockResponse)
        })
    })

    describe('renameSharedLabel', () => {
        test('calls renameSharedLabel with expected parameters', async () => {
            const args = { name: 'old', newName: 'new' }
            const requestMock = setupRestClientMock(null)
            const api = getTarget()

            await api.renameSharedLabel(args)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'POST',
                getSyncBaseUri(),
                ENDPOINT_REST_LABELS_SHARED_RENAME,
                DEFAULT_AUTH_TOKEN,
                args,
            )
        })

        test('returns success result from rest client', async () => {
            const args = { name: 'old', newName: 'new' }
            setupRestClientMock(null)
            const api = getTarget()

            const result = await api.renameSharedLabel(args)

            expect(result).toBe(true)
        })
    })

    describe('removeSharedLabel', () => {
        test('calls removeSharedLabel with expected parameters', async () => {
            const args = { name: 'toremove' }
            const requestMock = setupRestClientMock(null)
            const api = getTarget()

            await api.removeSharedLabel(args)

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith(
                'POST',
                getSyncBaseUri(),
                ENDPOINT_REST_LABELS_SHARED_REMOVE,
                DEFAULT_AUTH_TOKEN,
                args,
            )
        })

        test('returns success result from rest client', async () => {
            const args = { name: 'toremove' }
            setupRestClientMock(null)
            const api = getTarget()

            const result = await api.removeSharedLabel(args)

            expect(result).toBe(true)
        })
    })
})
