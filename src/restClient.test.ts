import Axios, { AxiosStatic, AxiosResponse, AxiosError } from 'axios'
import { post, get } from './restClient'
import { mock } from 'jest-mock-extended'
import { TodoistRequestError } from './types/errors'
import * as caseConverter from 'axios-case-converter'

jest.mock('axios')

const DEFAULT_BASE_URI = 'https://someapi.com/'
const DEFAULT_ENDPOINT = 'endpoint'
const DEFAULT_AUTH_TOKEN = 'AToken'

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
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

    jest.spyOn(caseConverter, 'default').mockImplementation(() => axiosMock)
    return axiosMock
}

const setupAxiosMockWithError = (statusCode: number, responseData: unknown) => {
    const axiosMock = Axios as jest.Mocked<typeof Axios>
    const axiosError = mock<AxiosError>({
        message: DEFAULT_ERROR_MESSAGE,
        response: { status: statusCode, data: responseData },
    })
    axiosMock.get.mockImplementation(() => {
        throw axiosError
    })
    axiosMock.post.mockImplementation(() => {
        throw axiosError
    })
    return axiosMock
}

describe('restClient', () => {
    let axiosMock: jest.Mocked<AxiosStatic>

    beforeEach(() => {
        axiosMock = setupAxiosMock()
    })

    test('get creates axios client with expected configuration', async () => {
        await get(DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.create).toBeCalledTimes(1)
        expect(axiosMock.create).toBeCalledWith({ headers: DEFAULT_HEADERS })
    })

    test('get calls axios with expected endpoint', async () => {
        await get(DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.get).toBeCalledTimes(1)
        expect(axiosMock.get).toBeCalledWith(DEFAULT_BASE_URI + DEFAULT_ENDPOINT)
    })

    test('get returns response from axios', async () => {
        const result = await get(DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.get).toBeCalledTimes(1)
        expect(result).toEqual(DEFAULT_RESPONSE)
    })

    test('get throws TodoistRequestError on axios error with expected values', async () => {
        const statusCode = 403
        const responseData = 'Some Data'
        axiosMock = setupAxiosMockWithError(statusCode, responseData)

        expect.assertions(3)

        try {
            await get(DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_AUTH_TOKEN)
        } catch (e) {
            expect(e.message).toEqual(DEFAULT_ERROR_MESSAGE)
            expect(e.httpStatusCode).toEqual(statusCode)
            expect(e.responseData).toEqual(responseData)
        }
    })

    test('post creates axios client with expected configuration', async () => {
        await post(DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_PAYLOAD, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.create).toBeCalledTimes(1)
        expect(axiosMock.create).toBeCalledWith({ headers: DEFAULT_HEADERS })
    })

    test('post sends expected endpoint and payload to axios', async () => {
        await post(DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_PAYLOAD, DEFAULT_AUTH_TOKEN)

        expect(axiosMock.post).toBeCalledTimes(1)
        expect(axiosMock.post).toBeCalledWith(DEFAULT_BASE_URI + DEFAULT_ENDPOINT, DEFAULT_PAYLOAD)
    })

    test('post returns response from axios', async () => {
        const result = await post(
            DEFAULT_BASE_URI,
            DEFAULT_ENDPOINT,
            DEFAULT_PAYLOAD,
            DEFAULT_AUTH_TOKEN,
        )

        expect(axiosMock.post).toBeCalledTimes(1)
        expect(result).toEqual(DEFAULT_RESPONSE)
    })

    test('post throws TodoistRequestError on axios error with expected values', async () => {
        const statusCode = 403
        const responseData = 'Some Data'
        axiosMock = setupAxiosMockWithError(statusCode, responseData)

        expect.assertions(3)

        try {
            await post(DEFAULT_BASE_URI, DEFAULT_ENDPOINT, DEFAULT_PAYLOAD, DEFAULT_AUTH_TOKEN)
        } catch (e) {
            expect(e.message).toEqual(DEFAULT_ERROR_MESSAGE)
            expect(e.httpStatusCode).toEqual(statusCode)
            expect(e.responseData).toEqual(responseData)
        }
    })

    test('TodoistRequestError reports isAuthenticationError for relevant status codes', async () => {
        const statusCode = 403

        const requestError = new TodoistRequestError('An Error', statusCode, undefined)
        expect(requestError.isAuthenticationError()).toBeTruthy()
    })
})
