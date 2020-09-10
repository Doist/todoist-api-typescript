import Axios, { AxiosResponse, AxiosError } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import urljoin from 'url-join'
import { TodoistRequestError } from './types/errors'
import { HttpMethod } from './types/http'

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

export const isSuccess = (response: AxiosResponse): boolean =>
    response.status >= 200 && response.status < 300

export const request = async <T extends unknown>(
    httpMethod: HttpMethod,
    baseUri: string,
    relativePath: string,
    apiToken: string,
    payload?: unknown,
): Promise<AxiosResponse<T>> => {
    try {
        const axiosClient = getAxiosClient(apiToken)

        switch (httpMethod) {
            case 'GET':
                return await axiosClient.get<T>(urljoin(baseUri, relativePath), { params: payload })
            case 'POST':
                return await axiosClient.post<T>(urljoin(baseUri, relativePath), payload)
            case 'DELETE':
                return await axiosClient.delete<T>(urljoin(baseUri, relativePath))
        }
    } catch (error) {
        throw getTodoistRequestError(error)
    }
}
