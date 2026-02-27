import { jest } from '@jest/globals'
import { request, isSuccess, paramsSerializer } from './rest-client'
import { TodoistRequestError } from './types/errors'
import type { HttpResponse as TodoistHttpResponse } from './types/http'
import { server, http, HttpResponse, getLastRequest, captureRequest } from './test-utils/msw-setup'

const RANDOM_ID = 'SomethingRandom'

jest.mock('uuid', () => ({ v4: () => RANDOM_ID }))

const DEFAULT_BASE_URI = 'https://someapi.com/'
const DEFAULT_ENDPOINT = 'endpoint'
const DEFAULT_AUTH_TOKEN = 'AToken'

const DEFAULT_PAYLOAD = {
    someKey: 'someValue',
}

const DEFAULT_RESPONSE_DATA = DEFAULT_PAYLOAD

describe('restClient', () => {
    test('request makes GET request with correct URL and headers', async () => {
        const url = `${DEFAULT_BASE_URI}${DEFAULT_ENDPOINT}`

        server.use(
            http.get(url, ({ request }) => {
                const headers: Record<string, string> = {}
                request.headers.forEach((value, key) => {
                    headers[key] = value
                })

                captureRequest({ request, body: undefined })

                return HttpResponse.json(DEFAULT_RESPONSE_DATA, { status: 200 })
            }),
        )

        const result = await request({
            httpMethod: 'GET',
            baseUri: DEFAULT_BASE_URI,
            relativePath: DEFAULT_ENDPOINT,
        })

        // Verify the request was made
        const capturedRequest = getLastRequest()
        expect(capturedRequest).toBeDefined()
        expect(capturedRequest?.url).toBe(url)
        expect(capturedRequest?.method).toBe('GET')
        expect(capturedRequest?.headers['content-type']).toBe('application/json')

        // Verify the response structure
        expect(result.data).toEqual(DEFAULT_RESPONSE_DATA)
        expect(result.status).toBe(200)
        expect(result.statusText).toBe('OK')
    })

    test('request adds authorization header if token is passed', async () => {
        const url = `${DEFAULT_BASE_URI}${DEFAULT_ENDPOINT}`

        server.use(
            http.get(url, ({ request }) => {
                captureRequest({ request, body: undefined })
                return HttpResponse.json(DEFAULT_RESPONSE_DATA, { status: 200 })
            }),
        )

        await request({
            httpMethod: 'GET',
            baseUri: DEFAULT_BASE_URI,
            relativePath: DEFAULT_ENDPOINT,
            apiToken: DEFAULT_AUTH_TOKEN,
        })

        // Verify the request included the authorization header
        const capturedRequest = getLastRequest()
        expect(capturedRequest).toBeDefined()
        expect(capturedRequest?.headers['authorization']).toBe(`Bearer ${DEFAULT_AUTH_TOKEN}`)
        expect(capturedRequest?.headers['content-type']).toBe('application/json')
    })

    test('paramsSerializer works correctly', () => {
        const params = {
            filter: 'today',
            ids: [1, 2, 3],
            nullValue: null,
            undefinedValue: undefined,
        }

        const result = paramsSerializer(params)
        expect(result).toBe('filter=today&ids=%5B1%2C2%2C3%5D')
    })

    test('GET request converts camelCase parameters to snake_case in URL', async () => {
        server.use(
            http.get(`${DEFAULT_BASE_URI}${DEFAULT_ENDPOINT}`, ({ request }) => {
                captureRequest({ request, body: undefined })
                return HttpResponse.json(DEFAULT_RESPONSE_DATA, { status: 200 })
            }),
        )

        await request({
            httpMethod: 'GET',
            baseUri: DEFAULT_BASE_URI,
            relativePath: DEFAULT_ENDPOINT,
            apiToken: DEFAULT_AUTH_TOKEN,
            payload: {
                projectId: '123',
                isCompleted: true,
                parentItemId: '456',
                dueDatetime: '2024-01-01T12:00:00Z',
            },
        })

        // Verify all camelCase parameters were converted to snake_case in the URL
        const capturedRequest = getLastRequest()
        expect(capturedRequest).toBeDefined()
        expect(capturedRequest?.url).toContain('project_id=123')
        expect(capturedRequest?.url).toContain('is_completed=true')
        expect(capturedRequest?.url).toContain('parent_item_id=456')
        expect(capturedRequest?.url).toContain('due_datetime=2024-01-01T12%3A00%3A00Z')
        expect(capturedRequest?.headers['authorization']).toBe(`Bearer ${DEFAULT_AUTH_TOKEN}`)
    })

    test('POST request with JSON payload', async () => {
        server.use(
            http.post(`${DEFAULT_BASE_URI}${DEFAULT_ENDPOINT}`, async ({ request }) => {
                const body = await request.json()
                captureRequest({ request, body })
                return HttpResponse.json(DEFAULT_RESPONSE_DATA, { status: 200 })
            }),
        )

        const result = await request({
            httpMethod: 'POST',
            baseUri: DEFAULT_BASE_URI,
            relativePath: DEFAULT_ENDPOINT,
            apiToken: DEFAULT_AUTH_TOKEN,
            payload: DEFAULT_PAYLOAD,
        })

        // Verify the request body was converted to snake_case
        const capturedRequest = getLastRequest()
        expect(capturedRequest).toBeDefined()
        expect(capturedRequest?.method).toBe('POST')
        expect(capturedRequest?.headers['authorization']).toBe(`Bearer ${DEFAULT_AUTH_TOKEN}`)
        expect(capturedRequest?.body).toEqual({ some_key: 'someValue' })

        expect(result.data).toEqual(DEFAULT_RESPONSE_DATA)
    })

    test('Error handling returns TodoistRequestError', async () => {
        const statusCode = 403
        const responseData = 'Forbidden'

        server.use(
            http.get(`${DEFAULT_BASE_URI}${DEFAULT_ENDPOINT}`, () => {
                return HttpResponse.json(responseData, { status: statusCode })
            }),
        )

        await expect(
            request({
                httpMethod: 'GET',
                baseUri: DEFAULT_BASE_URI,
                relativePath: DEFAULT_ENDPOINT,
                apiToken: DEFAULT_AUTH_TOKEN,
            }),
        ).rejects.toThrow(TodoistRequestError)
    })

    const responseStatusTheories = [
        [100, false],
        [200, true],
        [299, true],
        [300, false],
    ] as const

    test.each(responseStatusTheories)('status code %p returns isSuccess %p', (status, expected) => {
        const response: TodoistHttpResponse = {
            status,
            statusText: 'Test',
            headers: {},
            data: null,
        }
        const success = isSuccess(response)
        expect(success).toEqual(expected)
    })
})
