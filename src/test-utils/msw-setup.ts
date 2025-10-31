import { setupServer } from 'msw/node'

// Default handlers for common API responses
export const handlers = [
    // Default handlers can be added here for common endpoints
    // Individual test files will add their own specific handlers
]

// Create MSW server instance
export const server = setupServer(...handlers)

// Setup MSW for tests
beforeAll(() => {
    server.listen({
        onUnhandledRequest: 'warn', // Log warnings for unhandled requests during development
    })
})

afterEach(() => {
    server.resetHandlers() // Reset handlers between tests
})

afterAll(() => {
    server.close() // Clean up after all tests
})

// Export MSW utilities for use in tests
export { http, HttpResponse } from 'msw'
