import type { HttpResponse, RetryConfig } from '../types/http'
import { isNetworkError } from '../types/http'

/**
 * Default retry configuration matching the original axios-retry behavior
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
    retries: 3,
    retryCondition: isNetworkError,
    retryDelay: (retryNumber: number) => {
        // First retry: immediate (0ms delay)
        // Subsequent retries: 500ms delay
        return retryNumber === 1 ? 0 : 500
    },
}

/**
 * Converts Headers object to a plain object
 */
function headersToObject(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
        result[key] = value
    })
    return result
}

/**
 * Creates an AbortSignal that times out after the specified duration
 */
function createTimeoutSignal(timeoutMs: number, existingSignal?: AbortSignal): AbortSignal {
    const controller = new AbortController()

    // Timeout logic
    const timeoutId = setTimeout(() => {
        controller.abort(new Error(`Request timeout after ${timeoutMs}ms`))
    }, timeoutMs)

    // If there's an existing signal, forward its abort
    if (existingSignal) {
        if (existingSignal.aborted) {
            clearTimeout(timeoutId)
            controller.abort(existingSignal.reason)
        } else {
            existingSignal.addEventListener(
                'abort',
                () => {
                    clearTimeout(timeoutId)
                    controller.abort(existingSignal.reason)
                },
                { once: true },
            )
        }
    }

    // Clean up timeout when request completes
    controller.signal.addEventListener('abort', () => {
        clearTimeout(timeoutId)
    })

    return controller.signal
}

/**
 * Performs a fetch request with retry logic and timeout support
 */
export async function fetchWithRetry<T = unknown>(args: {
    url: string
    options?: RequestInit & { timeout?: number }
    retryConfig?: Partial<RetryConfig>
}): Promise<HttpResponse<T>> {
    const { url, options = {}, retryConfig = {} } = args
    const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig }
    const { timeout, signal: userSignal, ...fetchOptions } = options

    let lastError: Error | undefined

    for (let attempt = 0; attempt <= config.retries; attempt++) {
        try {
            // Set up timeout and signal handling
            let requestSignal = userSignal || undefined
            if (timeout && timeout > 0) {
                requestSignal = createTimeoutSignal(timeout, requestSignal)
            }

            const response = await fetch(url, {
                ...fetchOptions,
                signal: requestSignal,
            })

            // Check if the response is successful
            if (!response.ok) {
                const errorMessage = `HTTP ${response.status}: ${response.statusText}`
                const error = new Error(errorMessage) as Error & {
                    status: number
                    statusText: string
                    response: HttpResponse<unknown>
                    data?: unknown
                }

                error.status = response.status
                error.statusText = response.statusText
                error.response = {
                    data: undefined, // Will be set below if we can parse the response
                    status: response.status,
                    statusText: response.statusText,
                    headers: headersToObject(response.headers),
                }

                // Try to get response body for error details
                try {
                    const responseText = await response.text()
                    let responseData: unknown
                    try {
                        responseData = responseText ? JSON.parse(responseText) : undefined
                    } catch {
                        responseData = responseText
                    }
                    error.data = responseData
                    error.response.data = responseData
                } catch {
                    // If we can't read the response body, that's OK
                }

                throw error
            }

            // Parse response
            const responseText = await response.text()
            let data: T
            try {
                data = responseText ? (JSON.parse(responseText) as T) : (undefined as T)
            } catch {
                // If JSON parsing fails, return the raw text
                data = responseText as T
            }

            return {
                data,
                status: response.status,
                statusText: response.statusText,
                headers: headersToObject(response.headers),
            }
        } catch (error) {
            lastError = error as Error

            // Check if this error should trigger a retry
            const shouldRetry = attempt < config.retries && config.retryCondition(lastError)

            if (!shouldRetry) {
                // Add network error flag for network errors
                if (isNetworkError(lastError)) {
                    const networkError = lastError
                    networkError.isNetworkError = true
                }
                throw lastError
            }

            // Wait before retrying
            const delay = config.retryDelay(attempt + 1)
            if (delay > 0) {
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
    }

    // This should never be reached, but just in case
    throw lastError || new Error('Request failed after retries')
}
