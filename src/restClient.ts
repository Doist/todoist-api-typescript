import Axios, { AxiosResponse, AxiosError } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import urljoin from 'url-join'
import { TodoistRequestError } from './types/errors'

const defaultHeaders = {
    'Content-Type': 'application/json',
}

const getAuthHeader = (apiKey: string) => `Bearer ${apiKey}`

const getTodoistRequestError = (error: Error): TodoistRequestError => {
    const requestError = new TodoistRequestError(error.message)

    const axiosError = error as AxiosError

    if (axiosError.response) {
        requestError.httpStatusCode = axiosError.response.status
        requestError.responseData = axiosError.response.data
    }
    return requestError
}

const getRequestConfiguration = (apiToken: string) => ({
    headers: {
        ...defaultHeaders,
        Authorization: getAuthHeader(apiToken),
    },
})

const getAxiosClient = (apiToken: string) => {
    const configuration = getRequestConfiguration(apiToken)
    return applyCaseMiddleware(Axios.create(configuration))
}

export const post = async <T extends unknown>(
    baseUri: string,
    relativePath: string,
    payload: unknown,
    apiToken: string,
): Promise<AxiosResponse<T>> => {
    try {
        const axiosClient = getAxiosClient(apiToken)

        return await axiosClient.post<T>(urljoin(baseUri, relativePath), payload)
    } catch (error) {
        throw getTodoistRequestError(error)
    }
}

export const get = async <T extends unknown>(
    baseUri: string,
    relativePath: string,
    apiToken: string,
): Promise<AxiosResponse<T>> => {
    try {
        const axiosClient = getAxiosClient(apiToken)

        return await axiosClient.get<T>(urljoin(baseUri, relativePath))
    } catch (error) {
        throw getTodoistRequestError(error)
    }
}
