import FormData from 'form-data'
import { createReadStream } from 'fs'
import { basename } from 'path'
import { fetchWithRetry } from './fetch-with-retry'
import type { HttpResponse } from '../types/http'

type UploadMultipartFileArgs = {
    baseUrl: string
    authToken: string
    endpoint: string
    file: Buffer | NodeJS.ReadableStream | string
    fileName?: string
    additionalFields: Record<string, string | number | boolean>
    requestId?: string
}

/**
 * Helper function to determine content-type from filename extension.
 * @param fileName - The filename to analyze
 * @returns The appropriate MIME type
 */
function getContentTypeFromFileName(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop()
    switch (extension) {
        case 'png':
            return 'image/png'
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg'
        case 'gif':
            return 'image/gif'
        case 'webp':
            return 'image/webp'
        case 'svg':
            return 'image/svg+xml'
        default:
            return 'application/octet-stream'
    }
}

/**
 * Uploads a file using multipart/form-data.
 *
 * This is a shared utility for uploading files to Todoist endpoints that require
 * multipart/form-data content type (e.g., file uploads, workspace logo uploads).
 *
 * @param baseUrl - The base API URL (e.g., https://api.todoist.com/api/v1/)
 * @param authToken - The authentication token
 * @param endpoint - The relative endpoint path (e.g., 'uploads', 'workspaces/logo')
 * @param file - The file content (Buffer, ReadableStream, or file system path)
 * @param fileName - Optional file name (required for Buffer/Stream, optional for paths)
 * @param additionalFields - Additional form fields to include (e.g., project_id, workspace_id)
 * @param requestId - Optional request ID for idempotency
 * @returns The response data from the server
 *
 * @example
 * ```typescript
 * // Upload from a file path
 * const result = await uploadMultipartFile(
 *   'https://api.todoist.com/api/v1/',
 *   'my-token',
 *   'uploads',
 *   '/path/to/file.pdf',
 *   undefined,
 *   { project_id: '12345' }
 * )
 *
 * // Upload from a Buffer
 * const buffer = Buffer.from('file content')
 * const result = await uploadMultipartFile(
 *   'https://api.todoist.com/api/v1/',
 *   'my-token',
 *   'uploads',
 *   buffer,
 *   'document.pdf',
 *   { project_id: '12345' }
 * )
 * ```
 */
export async function uploadMultipartFile<T>(args: UploadMultipartFileArgs): Promise<T> {
    const { baseUrl, authToken, endpoint, file, fileName, additionalFields, requestId } = args
    const form = new FormData()

    // Determine file type and add to form data
    if (typeof file === 'string') {
        // File path - create read stream
        const filePath = file
        const resolvedFileName = fileName || basename(filePath)

        form.append('file', createReadStream(filePath), resolvedFileName)
    } else if (Buffer.isBuffer(file)) {
        // Buffer - require fileName
        if (!fileName) {
            throw new Error('fileName is required when uploading from a Buffer')
        }
        // Detect content-type from filename extension
        const contentType = getContentTypeFromFileName(fileName)

        form.append('file', file, {
            filename: fileName,
            contentType: contentType,
        })
    } else {
        // Stream - require fileName
        if (!fileName) {
            throw new Error('fileName is required when uploading from a stream')
        }
        form.append('file', file, fileName)
    }

    // Add additional fields to the form
    for (const [key, value] of Object.entries(additionalFields)) {
        if (value !== undefined && value !== null) {
            form.append(key, value.toString())
        }
    }

    // Build the full URL
    const url = `${baseUrl}${endpoint}`

    // Prepare headers
    const headers: Record<string, string> = {
        Authorization: `Bearer ${authToken}`,
        ...form.getHeaders(),
    }

    if (requestId) {
        headers['X-Request-Id'] = requestId
    }

    // Make the request using fetch
    const response: HttpResponse<T> = await fetchWithRetry({
        url,
        options: {
            method: 'POST',
            body: form as unknown as BodyInit, // FormData from 'form-data' package is compatible with fetch
            headers,
            timeout: 30000, // 30 second timeout for file uploads
        },
    })

    return response.data
}
