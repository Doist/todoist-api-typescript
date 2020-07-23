import Axios, { AxiosResponse, AxiosError } from 'axios'
import urljoin from 'url-join'
import { TodoistRequestError } from './types/errors'

const defaultHeaders = {
    'Content-Type': 'application/json',
}

const authorizationHeaderString = (apiKey: string) => `Bearer ${apiKey}`

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
        Authorization: authorizationHeaderString(apiToken),
    },
})

export const post = async <T extends unknown>(
    baseUri: string,
    relativePath: string,
    payload: unknown,
    apiToken: string,
): Promise<AxiosResponse<T>> => {
    try {
        return await Axios.post<T>(
            urljoin(baseUri, relativePath),
            payload,
            getRequestConfiguration(apiToken),
        )
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
        return await Axios.get<T>(urljoin(baseUri, relativePath), getRequestConfiguration(apiToken))
    } catch (error) {
        throw getTodoistRequestError(error)
    }
}
