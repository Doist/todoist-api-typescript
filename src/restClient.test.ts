import Axios, { AxiosStatic, AxiosResponse, AxiosError } from 'axios'
import { request, isSuccess } from './restClient'
import { mock } from 'jest-mock-extended'
import { TodoistRequestError } from './types/errors'
import * as caseConverter from 'axios-case-converter'
import { assertInstance } from './testUtils/asserts'
import { getColor } from './utils'

jest.mock('axios')

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

const DEFAULT_PAYLOAD = {
    someKey: 'someValue',
}

const DEFAULT_RESPONSE = mock<AxiosResponse>({
    data: DEFAULT_PAYLOAD,
})

const DEFAULT_ERROR_MESSAGE = 'There was an error'

const setupAxiosMock = (response = DEFAULT_RESPONSE) => {
    const axiosMock = Axios as jest.Mocked<typeof Axios>

    axiosMock.get.mockResolvedValue(response)
    axiosMock.post.mockResolvedValue(response)
    axiosMock.delete.mockResolvedValue(response)

    jest.spyOn(caseConverter, 'default').mockImplementation(() => axiosMock)
    return axiosMock
}

const setupAxiosMockWithError = (statusCode: number, responseData: unknown) => {
    const axiosMock = Axios as jest.Mocked<typeof Axios>
    const axiosError = mock<AxiosError>({
        message: DEFAULT_ERROR_MESSAGE,
        response: { status: statusCode, data: responseData },
    })

    const errorFunc = () => {
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

        expect(axiosMock.create).toBeCalledTimes(1)
        expect(axiosMock.create).toBeCalledWith({ headers: DEFAULT_HEADERS })
    })

    test('request adds authorization header to config if token is passed', async () => {
        await request('GET', DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.create).toBeCalledTimes(1)
        expect(axiosMock.create).toBeCalledWith({ headers: AUTHORIZATION_HEADERS })
    })

    test('get calls axios with expected endpoint', async () => {
        await request('GET', DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.get).toBeCalledTimes(1)
        expect(axiosMock.get).toBeCalledWith(DEFAULT_BASE_URI + DEFAULT_ENDPOINT, {
            params: undefined,
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

        expect(axiosMock.get).toBeCalledTimes(1)
        expect(axiosMock.get).toBeCalledWith(DEFAULT_BASE_URI + DEFAULT_ENDPOINT, {
            params: DEFAULT_PAYLOAD,
        })
    })

    test('get returns response from axios', async () => {
        const result = await request('GET', DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.get).toBeCalledTimes(1)
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

        expect(axiosMock.post).toBeCalledTimes(1)
        expect(axiosMock.post).toBeCalledWith(DEFAULT_BASE_URI + DEFAULT_ENDPOINT, DEFAULT_PAYLOAD)
    })

    test('post returns response from axios', async () => {
        const result = await request(
            'POST',
            DEFAULT_BASE_URI,
            DEFAULT_ENDPOINT,
            DEFAULT_AUTH_TOKEN,
            DEFAULT_PAYLOAD,
        )

        expect(axiosMock.post).toBeCalledTimes(1)
        expect(result).toEqual(DEFAULT_RESPONSE)
    })

    test('delete calls axios with expected endpoint', async () => {
        await request('DELETE', DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.delete).toBeCalledTimes(1)
        expect(axiosMock.delete).toBeCalledWith(DEFAULT_BASE_URI + DEFAULT_ENDPOINT)
    })

    test('request throws TodoistRequestError on axios error with expected values', async () => {
        const statusCode = 403
        const responseData = 'Some Data'
        axiosMock = setupAxiosMockWithError(statusCode, responseData)

        expect.assertions(3)

        try {
            await request('GET', DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)
        } catch (e) {
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
        const response = mock<AxiosResponse>({ status })
        const success = isSuccess(response)
        expect(success).toEqual(expected)
    })
})
