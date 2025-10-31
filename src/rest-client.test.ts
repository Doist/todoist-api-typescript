import { request, isSuccess, paramsSerializer } from './rest-client'
import { TodoistRequestError } from './types/errors'
import { assertInstance } from './test-utils/asserts'
import { DEFAULT_REQUEST_ID } from './test-utils/test-defaults'
import { API_BASE_URI } from './consts/endpoints'
import type { HttpResponse as TodoistHttpResponse } from './types/http'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

const RANDOM_ID = 'SomethingRandom'

jest.mock('uuid', () => ({ v4: () => RANDOM_ID }))

const DEFAULT_BASE_URI = 'https://someapi.com/'
const DEFAULT_ENDPOINT = 'endpoint'
const DEFAULT_AUTH_TOKEN = 'AToken'

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
}

const AUTHORIZATION_HEADERS = {
    ...DEFAULT_HEADERS,
    Authorization: `Bearer ${DEFAULT_AUTH_TOKEN}`,
}

const HEADERS_WITH_REQUEST_ID = {
    ...DEFAULT_HEADERS,
    'X-Request-Id': DEFAULT_REQUEST_ID,
}

const DEFAULT_PAYLOAD = {
    someKey: 'someValue',
}

const DEFAULT_RESPONSE_DATA = DEFAULT_PAYLOAD

const DEFAULT_RESPONSE: TodoistHttpResponse = {
    data: DEFAULT_RESPONSE_DATA,
    status: 200,
    statusText: 'OK',
    headers: {},
}

const DEFAULT_ERROR_MESSAGE = 'There was an error'

// Helper to mock successful fetch responses
function mockSuccessfulResponse(responseData = DEFAULT_RESPONSE_DATA, status = 200) {
    const mockResponse = {
        ok: status >= 200 && status < 300,
        status,
        statusText: status === 200 ? 'OK' : 'Error',
        headers: new Map([['content-type', 'application/json']]),
        text: jest.fn().mockResolvedValue(JSON.stringify(responseData)),
        json: jest.fn().mockResolvedValue(responseData),
    }

    mockFetch.mockResolvedValue(mockResponse as unknown as Response)
    return mockResponse
}

// Helper to mock error responses
function mockErrorResponse(responseData: unknown, status: number) {
    const mockResponse = {
        ok: false,
        status,
        statusText: 'Error',
        headers: new Map([['content-type', 'application/json']]),
        text: jest.fn().mockResolvedValue(JSON.stringify(responseData)),
        json: jest.fn().mockResolvedValue(responseData),
    }

    mockFetch.mockResolvedValue(mockResponse as unknown as Response)
    return mockResponse
}

describe('restClient', () => {
    beforeEach(() => {
        mockFetch.mockClear()
    })

    test('request makes GET request with correct URL and headers', async () => {
        mockSuccessfulResponse(DEFAULT_RESPONSE_DATA)

        const result = await request({
            httpMethod: 'GET',
            baseUri: DEFAULT_BASE_URI,
            relativePath: DEFAULT_ENDPOINT,
        })

        // Verify the fetch was called with correct parameters
        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(mockFetch).toHaveBeenCalledWith(
            `${DEFAULT_BASE_URI}${DEFAULT_ENDPOINT}`,
            expect.objectContaining({
                method: 'GET',
                headers: DEFAULT_HEADERS,
            })
        )

        // Verify the response structure
        expect(result.data).toEqual(DEFAULT_RESPONSE_DATA)
        expect(result.status).toBe(200)
        expect(result.statusText).toBe('OK')
    })

    test('request adds authorization header if token is passed', async () => {
        mockSuccessfulResponse(DEFAULT_RESPONSE_DATA)

        await request({
            httpMethod: 'GET',
            baseUri: DEFAULT_BASE_URI,
            relativePath: DEFAULT_ENDPOINT,
            apiToken: DEFAULT_AUTH_TOKEN,
        })

        expect(mockFetch).toHaveBeenCalledWith(
            `${DEFAULT_BASE_URI}${DEFAULT_ENDPOINT}`,
            expect.objectContaining({
                method: 'GET',
                headers: AUTHORIZATION_HEADERS,
            })
        )
    })

    test('paramsSerializer works correctly', () => {
        const params = {
            filter: 'today',
            ids: [1, 2, 3],
            nullValue: null,
            undefinedValue: undefined,
        }

        const result = paramsSerializer(params)
        expect(result).toBe('filter=today&ids=1%2C2%2C3')
    })

    test('POST request with JSON payload', async () => {
        mockSuccessfulResponse(DEFAULT_RESPONSE_DATA)

        const result = await request({
            httpMethod: 'POST',
            baseUri: DEFAULT_BASE_URI,
            relativePath: DEFAULT_ENDPOINT,
            apiToken: DEFAULT_AUTH_TOKEN,
            payload: DEFAULT_PAYLOAD,
        })

        expect(mockFetch).toHaveBeenCalledWith(
            `${DEFAULT_BASE_URI}${DEFAULT_ENDPOINT}`,
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining(AUTHORIZATION_HEADERS),
                body: JSON.stringify({ some_key: 'someValue' }), // Should be snake_case
            })
        )

        expect(result.data).toEqual(DEFAULT_RESPONSE_DATA)
    })

    test('Error handling returns TodoistRequestError', async () => {
        const statusCode = 403
        const responseData = 'Forbidden'
        mockErrorResponse(responseData, statusCode)

        await expect(
            request({
                httpMethod: 'GET',
                baseUri: DEFAULT_BASE_URI,
                relativePath: DEFAULT_ENDPOINT,
                apiToken: DEFAULT_AUTH_TOKEN,
            })
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
