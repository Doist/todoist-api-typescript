import { TodoistApi } from './TodoistApi'
import { setupRestClientMock } from './testUtils/mocks'
import { getSyncBaseUri } from './consts/endpoints'
import axios from 'axios'
import * as fs from 'fs'
import { Readable } from 'stream'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

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
            mockedAxios.post.mockResolvedValue({
                data: mockUploadResult,
            })
        })

        test('uploads file from Buffer with fileName', async () => {
            const api = new TodoistApi('token')
            const buffer = Buffer.from('test file content')

            const result = await api.uploadFile({
                file: buffer,
                fileName: 'test-file.pdf',
                projectId: '12345',
            })

            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
            const [url, formData, config] = mockedAxios.post.mock.calls[0]

            expect(url).toBe(`${getSyncBaseUri()}uploads`)
            expect(config?.headers?.Authorization).toBe('Bearer token')
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
            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
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
            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        })

        test('uploads file from stream with fileName', async () => {
            const mockStream = new Readable()
            const api = new TodoistApi('token')

            await api.uploadFile({
                file: mockStream,
                fileName: 'stream-file.pdf',
            })

            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
        })

        test('throws error when Buffer provided without fileName', async () => {
            const api = new TodoistApi('token')
            const buffer = Buffer.from('test file content')

            await expect(
                api.uploadFile({
                    file: buffer,
                }),
            ).rejects.toThrow('fileName is required when uploading from a Buffer')
        })

        test('throws error when stream provided without fileName', async () => {
            const api = new TodoistApi('token')
            const mockStream = new Readable()

            await expect(
                api.uploadFile({
                    file: mockStream,
                }),
            ).rejects.toThrow('fileName is required when uploading from a stream')
        })

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

            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
            const [, , config] = mockedAxios.post.mock.calls[0]
            expect(config?.headers?.['X-Request-Id']).toBe(requestId)
        })

        test('uploads file without projectId', async () => {
            const api = new TodoistApi('token')
            const buffer = Buffer.from('test file content')

            await api.uploadFile({
                file: buffer,
                fileName: 'test.pdf',
            })

            expect(mockedAxios.post).toHaveBeenCalledTimes(1)
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
            expect(requestMock).toHaveBeenCalledWith(
                'DELETE',
                getSyncBaseUri(),
                'uploads',
                'token',
                {
                    fileUrl: 'https://cdn.todoist.com/uploads/test-file.pdf',
                },
                undefined,
            )
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
            expect(requestMock).toHaveBeenCalledWith(
                'DELETE',
                getSyncBaseUri(),
                'uploads',
                'token',
                {
                    fileUrl: 'https://cdn.todoist.com/uploads/test-file.pdf',
                },
                requestId,
            )
            expect(result).toBe(true)
        })
    })
})
