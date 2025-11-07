export type HttpMethod = 'POST' | 'GET' | 'DELETE' | 'PUT'

/**
 * HTTP response type that replaces AxiosResponse
 */
export type HttpResponse<T = unknown> = {
    data: T
    status: number
    statusText: string
    headers: Record<string, string>
}

/**
 * HTTP request configuration
 */
export type HttpRequestConfig = {
    method?: HttpMethod
    headers?: Record<string, string>
    timeout?: number
    signal?: AbortSignal
}

/**
 * Internal HTTP request options
 */
export type HttpRequestOptions = HttpRequestConfig & {
    url: string
    params?: Record<string, unknown>
    data?: unknown
}

/**
 * Configuration for retry behavior
 */
export type RetryConfig = {
    retries: number
    retryCondition: (error: Error) => boolean
    retryDelay: (retryNumber: number) => number
}

/**
 * Configuration for the HTTP client
 */
export type HttpClientConfig = {
    baseURL?: string
    headers?: Record<string, string>
    timeout?: number
    retry?: RetryConfig
}

/**
 * Network error type for retry logic
 */
export type NetworkError = Error & {
    code?: string
    isNetworkError: true
}

/**
 * HTTP error with status code and response data
 */
export type HttpError = Error & {
    status?: number
    statusText?: string
    response?: HttpResponse<unknown>
    data?: unknown
}

/**
 * Type guard to check if an error is a network error
 */
export function isNetworkError(error: Error): error is NetworkError {
    // Network errors in fetch are typically TypeError with specific messages
    return (
        (error instanceof TypeError &&
            (error.message.includes('fetch') ||
                error.message.includes('network') ||
                error.message.includes('Failed to fetch') ||
                error.message.includes('NetworkError'))) ||
        (error as NetworkError).isNetworkError === true
    )
}

/**
 * Type guard to check if an error is an HTTP error
 */
export function isHttpError(error: Error): error is HttpError {
    return 'status' in error && typeof (error as HttpError).status === 'number'
}

/**
 * Custom fetch response interface that custom HTTP clients must implement
 */
export type CustomFetchResponse = {
    ok: boolean
    status: number
    statusText: string
    headers: Record<string, string>
    text(): Promise<string>
    json(): Promise<unknown>
}

/**
 * Custom fetch function type for alternative HTTP clients
 */
export type CustomFetch = (
    url: string,
    options?: RequestInit & { timeout?: number },
) => Promise<CustomFetchResponse>
