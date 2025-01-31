// eslint-disable-next-line import/no-named-as-default
import Axios, { AxiosResponse, AxiosError } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import { TodoistRequestError } from './types/errors'
import { HttpMethod } from './types/http'
import { v4 as uuidv4 } from 'uuid'
import axiosRetry from 'axios-retry'
import { API_BASE_URI } from './consts/endpoints'

export function paramsSerializer(params: Record<string, unknown>) {
    const qs = new URLSearchParams()

    Object.keys(params).forEach((key) => {
        const value = params[key]
        if (Array.isArray(value)) {
            qs.append(key, value.join(','))
        } else {
            qs.append(key, String(value))
        }
    })

    return qs.toString()
}

const defaultHeaders = {
    'Content-Type': 'application/json',
}

function getAuthHeader(apiKey: string) {
    return `Bearer ${apiKey}`
}

function isNetworkError(error: AxiosError) {
    return Boolean(!error.response && error.code !== 'ECONNABORTED')
}

function getRetryDelay(retryCount: number) {
    return retryCount === 1 ? 0 : 500
}

function isAxiosError(error: unknown): error is AxiosError {
    return Boolean((error as AxiosError)?.isAxiosError)
}

function getTodoistRequestError(
    error: Error | AxiosError,
    originalStack?: Error,
): TodoistRequestError {
    const requestError = new TodoistRequestError(error.message)

    requestError.stack = isAxiosError(error) && originalStack ? originalStack.stack : error.stack

    if (isAxiosError(error) && error.response) {
        requestError.httpStatusCode = error.response.status
        requestError.responseData = error.response.data
    }

    return requestError
}

function getRequestConfiguration(baseURL: string, apiToken?: string, requestId?: string) {
    const authHeader = apiToken ? { Authorization: getAuthHeader(apiToken) } : undefined
    const requestIdHeader = requestId ? { 'X-Request-Id': requestId } : undefined
    const headers = { ...defaultHeaders, ...authHeader, ...requestIdHeader }

    return { baseURL, headers }
}

function getAxiosClient(baseURL: string, apiToken?: string, requestId?: string) {
    const configuration = getRequestConfiguration(baseURL, apiToken, requestId)
    const client = applyCaseMiddleware(Axios.create(configuration))

    axiosRetry(client, {
        retries: 3,
        retryCondition: isNetworkError,
        retryDelay: getRetryDelay,
    })

    return client
}

export function isSuccess(response: AxiosResponse): boolean {
    return response.status >= 200 && response.status < 300
}

export async function request<T>(
    httpMethod: HttpMethod,
    baseUri: string,
    relativePath: string,
    apiToken?: string,
    payload?: Record<string, unknown>,
    requestId?: string,
    hasSyncCommands?: boolean,
): Promise<AxiosResponse<T>> {
    // axios loses the original stack when returning errors, for the sake of better reporting
    // we capture it here and reapply it to any thrown errors.
    // Ref: https://github.com/axios/axios/issues/2387
    const originalStack = new Error()

    try {
        // Sync api don't allow a request id in the CORS
        if (httpMethod === 'POST' && !requestId && !baseUri.includes(API_BASE_URI)) {
            requestId = uuidv4()
        }

        const axiosClient = getAxiosClient(baseUri, apiToken, requestId)

        switch (httpMethod) {
            case 'GET':
                return await axiosClient.get<T>(relativePath, {
                    params: payload,
                    paramsSerializer: {
                        serialize: paramsSerializer,
                    },
                })
            case 'POST':
                return await axiosClient.post<T>(
                    relativePath,
                    hasSyncCommands ? JSON.stringify(payload) : payload,
                )
            case 'DELETE':
                return await axiosClient.delete<T>(relativePath)
        }
    } catch (error: unknown) {
        if (!isAxiosError(error) && !(error instanceof Error)) {
            throw new Error('An unknown error occurred during the request')
        }

        throw getTodoistRequestError(error, originalStack)
    }
}
