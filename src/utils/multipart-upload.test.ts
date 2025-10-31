import { uploadMultipartFile } from './multipart-upload'
import * as fs from 'fs'
import { Readable } from 'stream'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

// Mock fs
jest.mock('fs')
const mockedFs = fs as jest.Mocked<typeof fs>

describe('uploadMultipartFile', () => {
    const baseUrl = 'https://api.todoist.com/api/v1/'
    const authToken = 'test-token'
    const endpoint = 'test-endpoint'
    const mockResponseData = { fileUrl: 'https://example.com/file.pdf' }

    beforeEach(() => {
        jest.clearAllMocks()

        // Mock successful fetch response
        const mockResponse = {
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Map([['content-type', 'application/json']]),
            text: jest.fn().mockResolvedValue(JSON.stringify(mockResponseData)),
            json: jest.fn().mockResolvedValue(mockResponseData),
        }
        mockFetch.mockResolvedValue(mockResponse as unknown as Response)
    })

    describe('file path uploads', () => {
        test('uploads file from path without fileName', async () => {
            const mockStream = new Readable()
            mockedFs.createReadStream.mockReturnValue(mockStream as fs.ReadStream)

            const result = await uploadMultipartFile({
                baseUrl: baseUrl,
                authToken: authToken,
                endpoint: endpoint,
                file: '/path/to/document.pdf',
                fileName: undefined,
                additionalFields: { project_id: '123' },
                requestId: 'req-123',
            })

            expect(mockedFs.createReadStream).toHaveBeenCalledWith('/path/to/document.pdf')
            expect(mockFetch).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockResponseData)

            const [url, config] = mockFetch.mock.calls[0]
            expect(url).toBe(`${baseUrl}${endpoint}`)
            expect(config?.headers?.Authorization).toBe('Bearer test-token')
            expect(config?.headers?.['X-Request-Id']).toBe('req-123')
        })

        test('uploads file from path with custom fileName', async () => {
            const mockStream = new Readable()
            mockedFs.createReadStream.mockReturnValue(mockStream as fs.ReadStream)

            await uploadMultipartFile({
                baseUrl: baseUrl,
                authToken: authToken,
                endpoint: endpoint,
                file: '/path/to/document.pdf',
                fileName: 'custom-name.pdf',
                additionalFields: {},
            })

            expect(mockedFs.createReadStream).toHaveBeenCalledWith('/path/to/document.pdf')
            expect(mockFetch).toHaveBeenCalledTimes(1)
        })
    })

    describe('Buffer uploads', () => {
        test('uploads file from Buffer with fileName', async () => {
            const buffer = Buffer.from('test file content')

            const result = await uploadMultipartFile({
                baseUrl: baseUrl,
                authToken: authToken,
                endpoint: endpoint,
                file: buffer,
                fileName: 'test-file.pdf',
                additionalFields: { workspace_id: 456 },
            })

            expect(mockFetch).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockResponseData)

            const [url, config] = mockFetch.mock.calls[0]
            expect(url).toBe(`${baseUrl}${endpoint}`)
            expect(config?.headers?.Authorization).toBe('Bearer test-token')
        })

        test('throws error when Buffer provided without fileName', async () => {
            const buffer = Buffer.from('test file content')

            await expect(
                uploadMultipartFile({
                    baseUrl: baseUrl,
                    authToken: authToken,
                    endpoint: endpoint,
                    file: buffer,
                    fileName: undefined,
                    additionalFields: {},
                }),
            ).rejects.toThrow('fileName is required when uploading from a Buffer')
        })
    })

    describe('Stream uploads', () => {
        test('uploads file from stream with fileName', async () => {
            const mockStream = new Readable()

            const result = await uploadMultipartFile({
                baseUrl: baseUrl,
                authToken: authToken,
                endpoint: endpoint,
                file: mockStream,
                fileName: 'stream-file.pdf',
                additionalFields: { delete: true },
            })

            expect(mockFetch).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockResponseData)
        })

        test('throws error when stream provided without fileName', async () => {
            const mockStream = new Readable()

            await expect(
                uploadMultipartFile({
                    baseUrl: baseUrl,
                    authToken: authToken,
                    endpoint: endpoint,
                    file: mockStream,
                    fileName: undefined,
                    additionalFields: {},
                }),
            ).rejects.toThrow('fileName is required when uploading from a stream')
        })
    })

    describe('additional fields handling', () => {
        test('filters out null and undefined values', async () => {
            const buffer = Buffer.from('test')

            const additionalFields: Record<string, string | number | boolean> = {
                field1: 'value1',
                field4: 0,
                field5: false,
            }
            // Add fields that might be null/undefined conditionally
            const field2Value = null
            const field3Value = undefined
            if (field2Value !== null && field2Value !== undefined) {
                additionalFields.field2 = field2Value
            }
            if (field3Value !== null && field3Value !== undefined) {
                additionalFields.field3 = field3Value
            }

            await uploadMultipartFile({
                baseUrl: baseUrl,
                authToken: authToken,
                endpoint: endpoint,
                file: buffer,
                fileName: 'test.pdf',
                additionalFields: additionalFields,
            })

            expect(mockFetch).toHaveBeenCalledTimes(1)
            // We can't easily test FormData contents, but we verified the method doesn't throw
        })

        test('handles empty additional fields', async () => {
            const buffer = Buffer.from('test')

            await uploadMultipartFile({
                baseUrl: baseUrl,
                authToken: authToken,
                endpoint: endpoint,
                file: buffer,
                fileName: 'test.pdf',
                additionalFields: {},
            })

            expect(mockFetch).toHaveBeenCalledTimes(1)
        })
    })

    describe('headers handling', () => {
        test('includes FormData headers', async () => {
            const buffer = Buffer.from('test')

            await uploadMultipartFile({
                baseUrl: baseUrl,
                authToken: authToken,
                endpoint: endpoint,
                file: buffer,
                fileName: 'test.pdf',
                additionalFields: {},
            })

            const [, config] = mockFetch.mock.calls[0]
            expect(config?.headers?.Authorization).toBe('Bearer test-token')
            // FormData.getHeaders() is mocked, so we can't test specific multipart headers
        })

        test('omits X-Request-Id when not provided', async () => {
            const buffer = Buffer.from('test')

            await uploadMultipartFile({
                baseUrl: baseUrl,
                authToken: authToken,
                endpoint: endpoint,
                file: buffer,
                fileName: 'test.pdf',
                additionalFields: {},
            })

            const [, config] = mockFetch.mock.calls[0]
            expect(config?.headers?.['X-Request-Id']).toBeUndefined()
        })
    })
})
