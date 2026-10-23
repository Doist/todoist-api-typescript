import { TodoistApi } from '.'
import { getSyncBaseUri, ENDPOINT_REST_FILTERS } from './consts/endpoints'
import { captureRequest, getLastRequest, server, http, HttpResponse } from './test-utils/msw-setup'
import { DEFAULT_AUTH_TOKEN } from './test-utils/test-defaults'

function getTarget() {
    return new TodoistApi(DEFAULT_AUTH_TOKEN)
}

describe('TodoistApi filter endpoints', () => {
    describe('deleteFilter', () => {
        test('returns success result from rest client', async () => {
            server.use(
                http.delete(`${getSyncBaseUri()}${ENDPOINT_REST_FILTERS}/789`, () => {
                    return HttpResponse.json(undefined, { status: 204 })
                }),
            )
            const api = getTarget()

            const response = await api.deleteFilter('789')

            expect(response).toEqual(true)
        })

        test('sends configured headers', async () => {
            server.use(
                http.delete(`${getSyncBaseUri()}${ENDPOINT_REST_FILTERS}/789`, ({ request }) => {
                    captureRequest({ request, body: undefined })
                    return HttpResponse.json(undefined, { status: 204 })
                }),
            )
            const api = new TodoistApi(DEFAULT_AUTH_TOKEN, {
                headers: { 'Doist-Platform': 'cli' },
            })

            await api.deleteFilter('789')

            expect(getLastRequest()?.headers['doist-platform']).toBe('cli')
        })

        test('throws on not found', async () => {
            server.use(
                http.delete(`${getSyncBaseUri()}${ENDPOINT_REST_FILTERS}/789`, () => {
                    return HttpResponse.json({ error: 'Filter not found' }, { status: 404 })
                }),
            )
            const api = getTarget()

            await expect(api.deleteFilter('789')).rejects.toMatchObject({
                httpStatusCode: 404,
            })
        })
    })
})
