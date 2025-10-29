import FormData from 'form-data'
import { createReadStream } from 'fs'
import { basename } from 'path'
import axios, { type AxiosResponse } from 'axios'

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
export async function uploadMultipartFile<T>(
    baseUrl: string,
    authToken: string,
    endpoint: string,
    file: Buffer | NodeJS.ReadableStream | string,
    fileName: string | undefined,
    additionalFields: Record<string, string | number | boolean>,
    requestId?: string,
): Promise<T> {
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
        form.append('file', file, fileName)
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

    // Make the request using axios
    const response: AxiosResponse<T> = await axios.post(url, form, { headers })

    return response.data
}
