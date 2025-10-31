import { TodoistRequestError } from './types/errors'
import { HttpMethod, HttpResponse, isNetworkError, isHttpError } from './types/http'
import { v4 as uuidv4 } from 'uuid'
import { API_BASE_URI } from './consts/endpoints'
import { camelCaseKeys, snakeCaseKeys } from './utils/case-conversion'
import { fetchWithRetry } from './utils/fetch-with-retry'

type GetTodoistRequestErrorArgs = {
    error: Error
    originalStack?: Error
}

type GetRequestConfigurationArgs = {
    baseURL: string
    apiToken?: string
    requestId?: string
    customHeaders?: Record<string, string>
}

type GetHttpClientArgs = {
    baseURL: string
    apiToken?: string
    requestId?: string
    customHeaders?: Record<string, string>
}

type RequestArgs = {
    httpMethod: HttpMethod
    baseUri: string
    relativePath: string
    apiToken?: string
    payload?: Record<string, unknown>
    requestId?: string
    hasSyncCommands?: boolean
    customHeaders?: Record<string, string>
}

export function paramsSerializer(params: Record<string, unknown>) {
    const qs = new URLSearchParams()

    Object.keys(params).forEach((key) => {
        const value = params[key]
        if (value != null) {
            if (Array.isArray(value)) {
                qs.append(key, value.join(','))
            } else {
                qs.append(key, String(value))
            }
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

function getRetryDelay(retryCount: number) {
    return retryCount === 1 ? 0 : 500
}

function getTodoistRequestError(args: GetTodoistRequestErrorArgs): TodoistRequestError {
    const { error, originalStack } = args
    const requestError = new TodoistRequestError(error.message)

    requestError.stack = originalStack ? originalStack.stack : error.stack

    if (isHttpError(error)) {
        requestError.httpStatusCode = error.status
        requestError.responseData = error.data
    }

    return requestError
}

function getRequestConfiguration(args: GetRequestConfigurationArgs) {
    const { baseURL, apiToken, requestId, customHeaders } = args
    const authHeader = apiToken ? { Authorization: getAuthHeader(apiToken) } : undefined
    const requestIdHeader = requestId ? { 'X-Request-Id': requestId } : undefined
    const headers = { ...defaultHeaders, ...authHeader, ...requestIdHeader, ...customHeaders }

    return { baseURL, headers }
}

function getHttpClientConfig(args: GetHttpClientArgs) {
    const { baseURL, apiToken, requestId, customHeaders } = args
    const configuration = getRequestConfiguration({ baseURL, apiToken, requestId, customHeaders })

    return {
        ...configuration,
        timeout: 30000, // 30 second timeout
        retry: {
            retries: 3,
            retryCondition: isNetworkError,
            retryDelay: getRetryDelay,
        },
    }
}

export function isSuccess(response: HttpResponse): boolean {
    return response.status >= 200 && response.status < 300
}

export async function request<T>(args: RequestArgs): Promise<HttpResponse<T>> {
    const {
        httpMethod,
        baseUri,
        relativePath,
        apiToken,
        payload,
        requestId: initialRequestId,
        hasSyncCommands,
        customHeaders,
    } = args

    // Capture original stack for better error reporting
    const originalStack = new Error()

    try {
        let requestId = initialRequestId
        // Sync api don't allow a request id in the CORS
        if (httpMethod === 'POST' && !requestId && !baseUri.includes(API_BASE_URI)) {
            requestId = uuidv4()
        }

        const config = getHttpClientConfig({ baseURL: baseUri, apiToken, requestId, customHeaders })
        const url = `${baseUri}${relativePath}`

        let fetchOptions: RequestInit & { timeout?: number } = {
            method: httpMethod,
            headers: config.headers,
            timeout: config.timeout,
        }

        let finalUrl = url

        switch (httpMethod) {
            case 'GET':
                // For GET requests, add query parameters to URL
                if (payload) {
                    const queryString = paramsSerializer(payload)
                    if (queryString) {
                        const separator = url.includes('?') ? '&' : '?'
                        finalUrl = `${url}${separator}${queryString}`
                    }
                }
                break
            case 'POST':
            case 'PUT':
                // Convert payload from camelCase to snake_case
                const convertedPayload = payload ? snakeCaseKeys(payload) : payload
                const body = hasSyncCommands
                    ? JSON.stringify(convertedPayload)
                    : JSON.stringify(convertedPayload)

                fetchOptions.body = body
                break
            case 'DELETE':
                // DELETE requests don't have a body
                break
        }

        // Make the request
        const response = await fetchWithRetry<T>({
            url: finalUrl,
            options: fetchOptions,
            retryConfig: config.retry,
        })

        // Convert snake_case response to camelCase
        const convertedData = camelCaseKeys(response.data)
        return { ...response, data: convertedData }
    } catch (error: unknown) {
        if (!(error instanceof Error)) {
            throw new Error('An unknown error occurred during the request')
        }

        throw getTodoistRequestError({ error, originalStack })
    }
}
