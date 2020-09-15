import { TodoistApi } from '.'
import { DEFAULT_AUTH_TOKEN, DEFAULT_LABEL } from './testUtils/testDefaults'
import { API_REST_BASE_URI, ENDPOINT_REST_LABELS } from './consts/endpoints'
import { setupRestClientMock } from './testUtils/mocks'

const getTarget = () => {
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

            const project = await api.getLabel(123)

            expect(project).toEqual(DEFAULT_LABEL)
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
})
