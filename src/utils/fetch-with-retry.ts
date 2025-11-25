import { Agent } from 'undici'
import type { HttpResponse, RetryConfig, CustomFetch, CustomFetchResponse } from '../types/http'
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
 * HTTP agent with keepAlive disabled to prevent hanging connections
 * This ensures the process exits immediately after requests complete
 */
const httpAgent = new Agent({
    keepAliveTimeout: 1, // Close connections after 1ms of idle time
    keepAliveMaxTimeout: 1, // Maximum time to keep connections alive
})

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
 * Creates an AbortSignal that aborts after timeoutMs. Returns the signal and a
 * clear function to cancel the timeout early.
 */
function createTimeoutSignal(
    timeoutMs: number,
    existingSignal?: AbortSignal,
): {
    signal: AbortSignal
    clear: () => void
} {
    const controller = new AbortController()

    // Timeout logic
    const timeoutId = setTimeout(() => {
        controller.abort(new Error(`Request timeout after ${timeoutMs}ms`))
    }, timeoutMs)

    const clear = () => clearTimeout(timeoutId)

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

    return { signal: controller.signal, clear }
}

/**
 * Converts native fetch Response to CustomFetchResponse for consistency
 */
function convertResponseToCustomFetch(response: Response): CustomFetchResponse {
    // Clone the response so we can read it multiple times (if clone method exists)
    const clonedResponse = response.clone ? response.clone() : response

    return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: headersToObject(response.headers),
        text: () => clonedResponse.text(),
        json: () => response.json(),
    }
}

/**
 * Performs a fetch request with retry logic and timeout support
 */
export async function fetchWithRetry<T = unknown>(args: {
    url: string
    options?: RequestInit & { timeout?: number }
    retryConfig?: Partial<RetryConfig>
    customFetch?: CustomFetch
}): Promise<HttpResponse<T>> {
    const { url, options = {}, retryConfig = {}, customFetch } = args
    const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig }
    const { timeout, signal: userSignal, ...fetchOptions } = options

    let lastError: Error | undefined

    for (let attempt = 0; attempt <= config.retries; attempt++) {
        // Timeout clear function for this attempt (hoisted for catch scope)
        let clearTimeoutFn: (() => void) | undefined

        try {
            // Set up timeout and signal handling
            let requestSignal = userSignal || undefined
            if (timeout && timeout > 0) {
                const timeoutResult = createTimeoutSignal(timeout, requestSignal)

                requestSignal = timeoutResult.signal
                clearTimeoutFn = timeoutResult.clear
            }

            // Use custom fetch or native fetch
            let fetchResponse: CustomFetchResponse
            if (customFetch) {
                fetchResponse = await customFetch(url, {
                    ...fetchOptions,
                    signal: requestSignal,
                    timeout,
                })
            } else {
                const nativeResponse = await fetch(url, {
                    ...fetchOptions,
                    signal: requestSignal,
                    // @ts-expect-error - dispatcher is a valid option for Node.js fetch but not in the TS types
                    dispatcher: httpAgent,
                })
                fetchResponse = convertResponseToCustomFetch(nativeResponse)
            }

            // Check if the response is successful
            if (!fetchResponse.ok) {
                const errorMessage = `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`
                const error = new Error(errorMessage) as Error & {
                    status: number
                    statusText: string
                    response: HttpResponse<unknown>
                    data?: unknown
                }

                error.status = fetchResponse.status
                error.statusText = fetchResponse.statusText
                error.response = {
                    data: undefined, // Will be set below if we can parse the response
                    status: fetchResponse.status,
                    statusText: fetchResponse.statusText,
                    headers: fetchResponse.headers,
                }

                // Try to get response body for error details
                try {
                    const responseText = await fetchResponse.text()
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
            const responseText = await fetchResponse.text()
            let data: T
            try {
                data = responseText ? (JSON.parse(responseText) as T) : (undefined as T)
            } catch {
                // If JSON parsing fails, return the raw text
                data = responseText as T
            }

            // Success – clear pending timeout (if any) so Node can exit promptly
            if (clearTimeoutFn) {
                clearTimeoutFn()
            }

            return {
                data,
                status: fetchResponse.status,
                statusText: fetchResponse.statusText,
                headers: fetchResponse.headers,
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

                if (clearTimeoutFn) {
                    clearTimeoutFn()
                }

                throw lastError
            }

            // Wait before retrying
            const delay = config.retryDelay(attempt + 1)
            if (delay > 0) {
                await new Promise((resolve) => setTimeout(resolve, delay))
            }

            // Retry path – ensure this attempt's timeout is cleared before looping
            if (clearTimeoutFn) {
                clearTimeoutFn()
            }
        }
    }

    // This should never be reached, but just in case
    throw lastError || new Error('Request failed after retries')
}
