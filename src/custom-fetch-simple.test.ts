import { TodoistApi } from './todoist-api'
import { CustomFetch, CustomFetchResponse } from './types/http'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

const DEFAULT_AUTH_TOKEN = 'test-auth-token'

describe('Custom Fetch Core Functionality', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Constructor Options', () => {
        it('should accept customFetch in options', () => {
            const mockCustomFetch: CustomFetch = jest.fn()
            const api = new TodoistApi(DEFAULT_AUTH_TOKEN, {
                customFetch: mockCustomFetch,
            })
            expect(api).toBeInstanceOf(TodoistApi)
        })

        it('should show deprecation warning for old constructor', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
            const api = new TodoistApi(DEFAULT_AUTH_TOKEN, 'https://custom.api.com')

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('deprecated'))
            expect(api).toBeInstanceOf(TodoistApi)
            consoleSpy.mockRestore()
        })
    })

    describe('Custom Fetch Usage', () => {
        it('should call custom fetch when provided', async () => {
            const mockCustomFetch = jest.fn().mockResolvedValue({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                text: () => Promise.resolve('{"id":"123"}'),
                json: () => Promise.resolve({ id: '123' }),
            } as CustomFetchResponse)

            const api = new TodoistApi(DEFAULT_AUTH_TOKEN, {
                customFetch: mockCustomFetch,
            })

            try {
                await api.getUser()
            } catch (error) {
                // Expected to fail validation, but custom fetch should be called
            }

            expect(mockCustomFetch).toHaveBeenCalledWith(
                'https://api.todoist.com/api/v1/user',
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        Authorization: `Bearer ${DEFAULT_AUTH_TOKEN}`,
                    }),
                }),
            )
        })

        it('should use native fetch when no custom fetch provided', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Map([['content-type', 'application/json']]),
                text: jest.fn().mockResolvedValue('{"id":"123"}'),
                json: jest.fn().mockResolvedValue({ id: '123' }),
            })

            const api = new TodoistApi(DEFAULT_AUTH_TOKEN)

            try {
                await api.getUser()
            } catch (error) {
                // Expected to fail validation, but native fetch should be called
            }

            expect(mockFetch).toHaveBeenCalled()
        })
    })
})
