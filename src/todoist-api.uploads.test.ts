import { TodoistApi } from './todoist-api'
import { setupRestClientMock } from './test-utils/mocks'
import { getSyncBaseUri } from './consts/endpoints'
import * as fs from 'fs'
import { Readable } from 'stream'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch as unknown as typeof fetch

// Mock fs
jest.mock('fs')
const mockedFs = fs as jest.Mocked<typeof fs>

describe('TodoistApi uploads', () => {
    describe('uploadFile', () => {
        const mockUploadResult = {
            fileUrl: 'https://cdn.todoist.com/uploads/test-file.pdf',
            fileName: 'test-file.pdf',
            fileSize: 1024,
            fileType: 'application/pdf',
            resourceType: 'file',
            uploadState: 'completed' as const,
            image: null,
            imageWidth: null,
            imageHeight: null,
        }

        beforeEach(() => {
            jest.clearAllMocks()

            // Mock successful fetch response
            const mockResponse = {
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Map([['content-type', 'application/json']]),
                text: jest.fn().mockResolvedValue(JSON.stringify(mockUploadResult)),
                json: jest.fn().mockResolvedValue(mockUploadResult),
            }
            mockFetch.mockResolvedValue(mockResponse as unknown as Response)
        })

        test('uploads file from Buffer with fileName', async () => {
            const api = new TodoistApi('token')
            const buffer = Buffer.from('test file content')

            const result = await api.uploadFile({
                file: buffer,
                fileName: 'test-file.pdf',
                projectId: '12345',
            })

            expect(mockFetch).toHaveBeenCalledTimes(1)
            const [url, config] = mockFetch.mock.calls[0]

            expect(url).toBe(`${getSyncBaseUri()}uploads`)
            expect((config as RequestInit)?.headers).toHaveProperty('Authorization', 'Bearer token')
            expect(result).toEqual(mockUploadResult)
        })

        test('uploads file from file path', async () => {
            const mockStream = new Readable()
            mockedFs.createReadStream.mockReturnValue(mockStream as fs.ReadStream)

            const api = new TodoistApi('token')

            const result = await api.uploadFile({
                file: '/path/to/document.pdf',
                projectId: '12345',
            })

            expect(mockedFs.createReadStream).toHaveBeenCalledWith('/path/to/document.pdf')
            expect(mockFetch).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockUploadResult)
        })

        test('uploads file from file path with custom fileName', async () => {
            const mockStream = new Readable()
            mockedFs.createReadStream.mockReturnValue(mockStream as fs.ReadStream)

            const api = new TodoistApi('token')

            await api.uploadFile({
                file: '/path/to/document.pdf',
                fileName: 'custom-name.pdf',
            })

            expect(mockedFs.createReadStream).toHaveBeenCalledWith('/path/to/document.pdf')
            expect(mockFetch).toHaveBeenCalledTimes(1)
        })

        test('uploads file from stream with fileName', async () => {
            const mockStream = new Readable()
            const api = new TodoistApi('token')

            await api.uploadFile({
                file: mockStream,
                fileName: 'stream-file.pdf',
            })

            expect(mockFetch).toHaveBeenCalledTimes(1)
        })

        test.each([
            {
                description: 'Buffer',
                file: Buffer.from('test file content'),
                expectedError: 'fileName is required when uploading from a Buffer',
            },
            {
                description: 'stream',
                file: new Readable(),
                expectedError: 'fileName is required when uploading from a stream',
            },
        ])(
            'throws error when $description provided without fileName',
            async ({ file, expectedError }) => {
                const api = new TodoistApi('token')

                await expect(
                    api.uploadFile({
                        file,
                    }),
                ).rejects.toThrow(expectedError)
            },
        )

        test('uploads file with requestId', async () => {
            const api = new TodoistApi('token')
            const buffer = Buffer.from('test file content')
            const requestId = 'test-request-id'

            await api.uploadFile(
                {
                    file: buffer,
                    fileName: 'test.pdf',
                },
                requestId,
            )

            expect(mockFetch).toHaveBeenCalledTimes(1)
            const [, config] = mockFetch.mock.calls[0]
            expect((config as RequestInit)?.headers).toHaveProperty('X-Request-Id', requestId)
        })

        test('uploads file without projectId', async () => {
            const api = new TodoistApi('token')
            const buffer = Buffer.from('test file content')

            await api.uploadFile({
                file: buffer,
                fileName: 'test.pdf',
            })

            expect(mockFetch).toHaveBeenCalledTimes(1)
        })
    })

    describe('deleteUpload', () => {
        test('deletes upload successfully', async () => {
            const requestMock = setupRestClientMock('ok', 200)
            const api = new TodoistApi('token')

            const result = await api.deleteUpload({
                fileUrl: 'https://cdn.todoist.com/uploads/test-file.pdf',
            })

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'DELETE',
                baseUri: getSyncBaseUri(),
                relativePath: 'uploads',
                apiToken: 'token',
                payload: {
                    fileUrl: 'https://cdn.todoist.com/uploads/test-file.pdf',
                },
                requestId: undefined,
            })
            expect(result).toBe(true)
        })

        test('deletes upload with requestId', async () => {
            const requestMock = setupRestClientMock('ok', 200)
            const api = new TodoistApi('token')
            const requestId = 'test-request-id'

            const result = await api.deleteUpload(
                {
                    fileUrl: 'https://cdn.todoist.com/uploads/test-file.pdf',
                },
                requestId,
            )

            expect(requestMock).toHaveBeenCalledTimes(1)
            expect(requestMock).toHaveBeenCalledWith({
                httpMethod: 'DELETE',
                baseUri: getSyncBaseUri(),
                relativePath: 'uploads',
                apiToken: 'token',
                payload: {
                    fileUrl: 'https://cdn.todoist.com/uploads/test-file.pdf',
                },
                requestId: requestId,
            })
            expect(result).toBe(true)
        })
    })
})
