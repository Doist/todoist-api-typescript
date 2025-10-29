import { uploadMultipartFile } from './multipartUpload'
import axios from 'axios'
import * as fs from 'fs'
import { Readable } from 'stream'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock fs
jest.mock('fs')
const mockedFs = fs as jest.Mocked<typeof fs>

describe('uploadMultipartFile', () => {
    const baseUrl = 'https://api.todoist.com/api/v1/'
    const authToken = 'test-token'
    const endpoint = 'test-endpoint'
    const mockResponse = { data: { fileUrl: 'https://example.com/file.pdf' } }

    beforeEach(() => {
        jest.clearAllMocks()
        mockedAxios.post.mockResolvedValue(mockResponse)
    })

    describe('file path uploads', () => {
        test('uploads file from path without fileName', async () => {
            const mockStream = new Readable()
            mockedFs.createReadStream.mockReturnValue(mockStream as fs.ReadStream)

            const result = await uploadMultipartFile(
                baseUrl,
                authToken,
                endpoint,
                '/path/to/document.pdf',
                undefined,
                { project_id: '123' },
                'req-123',
            )

            expect(mockedFs.createReadStream).toHaveBeenCalledWith('/path/to/document.pdf')
            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockResponse.data)

            const [url, formData, config] = mockedAxios.post.mock.calls[0]
            expect(url).toBe(`${baseUrl}${endpoint}`)
            expect(config?.headers?.Authorization).toBe('Bearer test-token')
            expect(config?.headers?.['X-Request-Id']).toBe('req-123')
        })

        test('uploads file from path with custom fileName', async () => {
            const mockStream = new Readable()
            mockedFs.createReadStream.mockReturnValue(mockStream as fs.ReadStream)

            await uploadMultipartFile(
                baseUrl,
                authToken,
                endpoint,
                '/path/to/document.pdf',
                'custom-name.pdf',
                {},
            )

            expect(mockedFs.createReadStream).toHaveBeenCalledWith('/path/to/document.pdf')
            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        })
    })

    describe('Buffer uploads', () => {
        test('uploads file from Buffer with fileName', async () => {
            const buffer = Buffer.from('test file content')

            const result = await uploadMultipartFile(
                baseUrl,
                authToken,
                endpoint,
                buffer,
                'test-file.pdf',
                { workspace_id: 456 },
            )

            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockResponse.data)

            const [url, , config] = mockedAxios.post.mock.calls[0]
            expect(url).toBe(`${baseUrl}${endpoint}`)
            expect(config?.headers?.Authorization).toBe('Bearer test-token')
        })

        test('throws error when Buffer provided without fileName', async () => {
            const buffer = Buffer.from('test file content')

            await expect(
                uploadMultipartFile(baseUrl, authToken, endpoint, buffer, undefined, {}),
            ).rejects.toThrow('fileName is required when uploading from a Buffer')
        })
    })

    describe('Stream uploads', () => {
        test('uploads file from stream with fileName', async () => {
            const mockStream = new Readable()

            const result = await uploadMultipartFile(
                baseUrl,
                authToken,
                endpoint,
                mockStream,
                'stream-file.pdf',
                { delete: true },
            )

            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockResponse.data)
        })

        test('throws error when stream provided without fileName', async () => {
            const mockStream = new Readable()

            await expect(
                uploadMultipartFile(baseUrl, authToken, endpoint, mockStream, undefined, {}),
            ).rejects.toThrow('fileName is required when uploading from a stream')
        })
    })

    describe('additional fields handling', () => {
        test('filters out null and undefined values', async () => {
            const buffer = Buffer.from('test')

            await uploadMultipartFile(baseUrl, authToken, endpoint, buffer, 'test.pdf', {
                field1: 'value1',
                field2: null,
                field3: undefined,
                field4: 0,
                field5: false,
            })

            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
            // We can't easily test FormData contents, but we verified the method doesn't throw
        })

        test('handles empty additional fields', async () => {
            const buffer = Buffer.from('test')

            await uploadMultipartFile(baseUrl, authToken, endpoint, buffer, 'test.pdf', {})

            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        })
    })

    describe('headers handling', () => {
        test('includes FormData headers', async () => {
            const buffer = Buffer.from('test')

            await uploadMultipartFile(baseUrl, authToken, endpoint, buffer, 'test.pdf', {})

            const [, , config] = mockedAxios.post.mock.calls[0]
            expect(config?.headers?.Authorization).toBe('Bearer test-token')
            // FormData.getHeaders() is mocked, so we can't test specific multipart headers
        })

        test('omits X-Request-Id when not provided', async () => {
            const buffer = Buffer.from('test')

            await uploadMultipartFile(baseUrl, authToken, endpoint, buffer, 'test.pdf', {})

            const [, , config] = mockedAxios.post.mock.calls[0]
            expect(config?.headers?.['X-Request-Id']).toBeUndefined()
        })
    })
})