import { setupServer } from 'msw/node'
import { http, HttpResponse, type HttpResponseResolver, type DefaultBodyType } from 'msw'

// Types for helper functions
export type MockApiOptions = {
    status?: number
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    headers?: Record<string, string>
}

export type CapturedRequest = {
    url: string
    method: string
    headers: Record<string, string>
    body: unknown
}

// Request capture storage
const capturedRequests: CapturedRequest[] = []

// Helper function to capture requests
export function captureRequest({ request, body }: { request: Request; body: unknown }): void {
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
        headers[key] = value
    })

    capturedRequests.push({
        url: request.url,
        method: request.method,
        headers,
        body,
    })
}

// Helper function to get the last captured request
export function getLastRequest(): CapturedRequest | undefined {
    return capturedRequests[capturedRequests.length - 1]
}

// Helper function to get all captured requests
export function getAllRequests(): CapturedRequest[] {
    return [...capturedRequests]
}

// Helper function to clear captured requests
export function clearCapturedRequests(): void {
    capturedRequests.length = 0
}

// Default handlers for common API responses
export const handlers = [
    // Default handlers can be added here for common endpoints
    // Individual test files will add their own specific handlers
]

// Create MSW server instance
export const server = setupServer(...handlers)

// Helper to create a resolver function for MSW handlers
function createResolver<T extends DefaultBodyType>(
    data: T,
    status: number,
    headers: Record<string, string>,
): HttpResponseResolver {
    return async function resolver({ request }) {
        let body: unknown = undefined

        if (request.method !== 'GET') {
            try {
                body = await request.json()
            } catch {
                // Body might not be JSON
                try {
                    body = await request.text()
                } catch {
                    // Body might be FormData or not parseable
                }
            }
        }

        captureRequest({ request, body })

        return HttpResponse.json(data, {
            status,
            headers,
        })
    }
}

// Helper to mock a successful API response
export function mockApiResponse<T extends DefaultBodyType>({
    endpoint,
    data,
    options = {},
}: {
    endpoint: string
    data: T
    options?: MockApiOptions
}): void {
    const { status = 200, method = 'GET', headers = {} } = options

    const resolver = createResolver(data, status, headers)

    const httpMethod = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch'
    server.use(http[httpMethod](endpoint, resolver))
}

// Helper to mock an error response
export function mockApiError<T extends DefaultBodyType>({
    endpoint,
    data,
    status,
    options = {},
}: {
    endpoint: string
    data: T
    status: number
    options?: Omit<MockApiOptions, 'status'>
}): void {
    mockApiResponse({ endpoint, data, options: { ...options, status } })
}

// Setup MSW for tests
beforeAll(() => {
    server.listen({
        onUnhandledRequest: 'error', // Throw errors for unhandled requests to catch unexpected fetch calls
    })
})

afterEach(() => {
    server.resetHandlers() // Reset handlers between tests
    clearCapturedRequests() // Clear captured requests between tests
})

afterAll(() => {
    server.close() // Clean up after all tests
})

// Export MSW utilities for use in tests
export { http, HttpResponse }
