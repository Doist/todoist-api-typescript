import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_LABEL } from './testUtils/testDefaults'
import { API_REST_BASE_URI, ENDPOINT_REST_LABELS } from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi label endpoints', () => {
    describe('getLabel', () => {
        test('calls get request with expected url', async () => {
            const labelId = 12
            const requestMock = setupRestClientMock(DEFAULT_LABEL)
            const api = getTarget()

            await api.getLabel(labelId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_LABELS}/${labelId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            setupRestClientMock(DEFAULT_LABEL)
            const api = getTarget()

            const label = await api.getLabel(123)

            expect(label).toEqual(DEFAULT_LABEL)
        })
    })

    describe('getLabels', () => {
        test('calls get on labels endpoint', async () => {
            const requestMock = setupRestClientMock([DEFAULT_LABEL])
            const api = getTarget()

            await api.getLabels()

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'GET',
                API_REST_BASE_URI,
                ENDPOINT_REST_LABELS,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns result from rest client', async () => {
            const labels = [DEFAULT_LABEL]
            setupRestClientMock(labels)
            const api = getTarget()

            const response = await api.getLabels()

            expect(response).toEqual(labels)
        })
    })

    describe('addLabel', () => {
        const DEFAULT_ADD_LABEL_ARGS = {
            name: 'This is a label',
        }

        test('calls post on restClient with expected parameters', async () => {
            const requestMock = setupRestClientMock(DEFAULT_LABEL)
            const api = getTarget()

            await api.addLabel(DEFAULT_ADD_LABEL_ARGS)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_REST_BASE_URI,
                ENDPOINT_REST_LABELS,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_ADD_LABEL_ARGS,
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
            const labelId = 123
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.updateLabel(labelId, DEFAULT_UPDATE_LABEL_ARGS)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'POST',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_LABELS}/${labelId}`,
                DEFAULT_AUTH_TOKEN,
                DEFAULT_UPDATE_LABEL_ARGS,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const result = await api.updateLabel(123, DEFAULT_UPDATE_LABEL_ARGS)

            expect(result).toEqual(true)
        })
    })

    describe('deleteLabel', () => {
        test('calls delete on expected label', async () => {
            const labelId = 123
            const requestMock = setupRestClientMock(undefined, 204)
            const api = getTarget()

            await api.deleteLabel(labelId)

            expect(requestMock).toBeCalledTimes(1)
            expect(requestMock).toBeCalledWith(
                'DELETE',
                API_REST_BASE_URI,
                `${ENDPOINT_REST_LABELS}/${labelId}`,
                DEFAULT_AUTH_TOKEN,
            )
        })

        test('returns success result from rest client', async () => {
            setupRestClientMock(undefined, 204)
            const api = getTarget()

            const result = await api.deleteLabel(123)

            expect(result).toEqual(true)
        })
    })
})
