// eslint-disable-next-line import/no-named-as-default
import Axios, { AxiosStatic, AxiosResponse, AxiosError } from 'axios'
import { request, isSuccess, paramsSerializer } from './restClient'
import { TodoistRequestError } from './types/errors'
import * as caseConverter from 'axios-case-converter'
import { assertInstance } from './testUtils/asserts'
import { DEFAULT_REQUEST_ID } from './testUtils/testDefaults'
import { API_BASE_URI } from './consts/endpoints'

const RANDOM_ID = 'SomethingRandom'

jest.mock('axios')
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

const DEFAULT_RESPONSE = {
    data: DEFAULT_PAYLOAD,
} as AxiosResponse

const DEFAULT_ERROR_MESSAGE = 'There was an error'

function setupAxiosMock(response = DEFAULT_RESPONSE) {
    const axiosMock = Axios as jest.Mocked<typeof Axios>

    axiosMock.create = jest.fn(() => axiosMock)
    axiosMock.get.mockResolvedValue(response)
    axiosMock.post.mockResolvedValue(response)
    axiosMock.delete.mockResolvedValue(response)

    jest.spyOn(caseConverter, 'default').mockImplementation(() => axiosMock)
    return axiosMock
}

function setupAxiosMockWithError(statusCode: number, responseData: unknown) {
    const axiosMock = Axios as jest.Mocked<typeof Axios>
    axiosMock.create = jest.fn(() => axiosMock)

    const axiosError = {
        message: DEFAULT_ERROR_MESSAGE,
        response: { status: statusCode, data: responseData } as AxiosResponse,
        isAxiosError: true,
    } as AxiosError

    function errorFunc(): Promise<unknown> {
        throw axiosError
    }

    axiosMock.get.mockImplementation(errorFunc)
    axiosMock.post.mockImplementation(errorFunc)
    axiosMock.delete.mockImplementation(errorFunc)
    return axiosMock
}

describe('restClient', () => {
    let axiosMock: jest.Mocked<AxiosStatic>

    beforeEach(() => {
        axiosMock = setupAxiosMock()
    })

    test('request creates axios client with default headers', async () => {
        await request('GET', DEFAULT_BASE_URI, DEFAULT_ENDPOINT)

        expect(axiosMock.create).toHaveBeenCalledTimes(1)
        expect(axiosMock.create).toHaveBeenCalledWith({
            baseURL: DEFAULT_BASE_URI,
            headers: DEFAULT_HEADERS,
        })
    })

    test('request adds authorization header to config if token is passed', async () => {
        await request('GET', DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.create).toHaveBeenCalledTimes(1)
        expect(axiosMock.create).toHaveBeenCalledWith({
            baseURL: DEFAULT_BASE_URI,
            headers: AUTHORIZATION_HEADERS,
        })
    })

    test('request adds request ID header to config if ID is passed', async () => {
        await request(
            'GET',
            DEFAULT_BASE_URI,
            DEFAULT_ENDPOINT,
            undefined,
            undefined,
            DEFAULT_REQUEST_ID,
        )

        expect(axiosMock.create).toHaveBeenCalledTimes(1)
        expect(axiosMock.create).toHaveBeenCalledWith({
            baseURL: DEFAULT_BASE_URI,
            headers: HEADERS_WITH_REQUEST_ID,
        })
    })

    test('get calls axios with expected endpoint', async () => {
        await request('GET', DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.get).toHaveBeenCalledTimes(1)
        expect(axiosMock.get).toHaveBeenCalledWith(DEFAULT_ENDPOINT, {
            params: undefined,
            paramsSerializer: {
                serialize: paramsSerializer,
            },
        })
    })

    test('get passes params to axios', async () => {
        await request(
            'GET',
            DEFAULT_BASE_URI,
            DEFAULT_ENDPOINT,
            DEFAULT_AUTH_TOKEN,
            DEFAULT_PAYLOAD,
        )

        expect(axiosMock.get).toHaveBeenCalledTimes(1)
        expect(axiosMock.get).toHaveBeenCalledWith(DEFAULT_ENDPOINT, {
            params: DEFAULT_PAYLOAD,
            paramsSerializer: {
                serialize: paramsSerializer,
            },
        })
    })

    test('get returns response from axios', async () => {
        const result = await request('GET', DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.get).toHaveBeenCalledTimes(1)
        expect(result).toEqual(DEFAULT_RESPONSE)
    })

    test('post sends expected endpoint and payload to axios', async () => {
        await request(
            'POST',
            DEFAULT_BASE_URI,
            DEFAULT_ENDPOINT,
            DEFAULT_AUTH_TOKEN,
            DEFAULT_PAYLOAD,
        )

        expect(axiosMock.post).toHaveBeenCalledTimes(1)
        expect(axiosMock.post).toHaveBeenCalledWith(DEFAULT_ENDPOINT, DEFAULT_PAYLOAD)
    })

    test('post sends expected endpoint and payload to axios when sync commands are used', async () => {
        await request(
            'POST',
            DEFAULT_BASE_URI,
            DEFAULT_ENDPOINT,
            DEFAULT_AUTH_TOKEN,
            DEFAULT_PAYLOAD,
            undefined,
            true,
        )

        expect(axiosMock.post).toHaveBeenCalledTimes(1)
        expect(axiosMock.post).toHaveBeenCalledWith(DEFAULT_ENDPOINT, '{"someKey":"someValue"}')
    })

    test('post returns response from axios', async () => {
        const result = await request(
            'POST',
            DEFAULT_BASE_URI,
            DEFAULT_ENDPOINT,
            DEFAULT_AUTH_TOKEN,
            DEFAULT_PAYLOAD,
        )

        expect(axiosMock.post).toHaveBeenCalledTimes(1)
        expect(result).toEqual(DEFAULT_RESPONSE)
    })

    test('random request ID is created if none provided for POST request', async () => {
        await request(
            'POST',
            DEFAULT_BASE_URI,
            DEFAULT_ENDPOINT,
            DEFAULT_AUTH_TOKEN,
            DEFAULT_PAYLOAD,
        )

        expect(axiosMock.create).toHaveBeenCalledWith({
            baseURL: DEFAULT_BASE_URI,
            headers: { ...AUTHORIZATION_HEADERS, 'X-Request-Id': RANDOM_ID },
        })
    })

    test('random request ID is not created if none provided for POST request on the sync endpoint', async () => {
        const syncUrl = new URL(API_BASE_URI, DEFAULT_BASE_URI).toString()
        await request('POST', syncUrl, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN, DEFAULT_PAYLOAD)

        expect(axiosMock.create).toHaveBeenCalledWith({
            baseURL: syncUrl,
            headers: { ...AUTHORIZATION_HEADERS },
        })
    })

    test('delete calls axios with expected endpoint', async () => {
        await request('DELETE', DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.delete).toHaveBeenCalledTimes(1)
        expect(axiosMock.delete).toHaveBeenCalledWith(DEFAULT_ENDPOINT)
    })

    test('request throws TodoistRequestError on axios error with expected values', async () => {
        const statusCode = 403
        const responseData = 'Some Data'
        axiosMock = setupAxiosMockWithError(statusCode, responseData)

        expect.assertions(3)

        try {
            await request('GET', DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)
        } catch (e: unknown) {
            assertInstance(e, TodoistRequestError)
            expect(e.message).toEqual(DEFAULT_ERROR_MESSAGE)
            expect(e.httpStatusCode).toEqual(statusCode)
            expect(e.responseData).toEqual(responseData)
        }
    })

    test('TodoistRequestError reports isAuthenticationError for relevant status codes', () => {
        const statusCode = 403

        const requestError = new TodoistRequestError('An Error', statusCode, undefined)
        expect(requestError.isAuthenticationError()).toBeTruthy()
    })

    const responseStatusTheories = [
        [100, false],
        [200, true],
        [299, true],
        [300, false],
    ] as const

    test.each(responseStatusTheories)('status code %p returns isSuccess %p', (status, expected) => {
        const response = { status } as AxiosResponse
        const success = isSuccess(response)
        expect(success).toEqual(expected)
    })
})
