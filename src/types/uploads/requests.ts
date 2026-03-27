/**
 * Arguments for uploading a file.
 * @see https://developer.todoist.com/api/v1/#tag/Uploads/operation/upload_file_api_v1_uploads_post
 */
export type UploadFileArgs = {
    /**
     * The file content to upload. Can be:
     * - Buffer: File content as a Buffer (requires fileName)
     * - ReadableStream: File content as a stream (requires fileName)
     * - string: Path to a file on the filesystem (fileName is optional, will be inferred from path)
     */
    file: Buffer | NodeJS.ReadableStream | string | Blob
    /**
     * The name of the file. Required for Buffer and Stream inputs.
     * Optional for file path strings and File objects (will be inferred if not provided).
     */
    fileName?: string
    /**
     * The project ID to associate the upload with.
     */
    projectId?: string | null
}

/**
 * Arguments for deleting an uploaded file.
 * @see https://developer.todoist.com/api/v1/#tag/Uploads/operation/delete_upload_api_v1_uploads_delete
 */
export type DeleteUploadArgs = {
    /**
     * The URL of the file to delete.
     */
    fileUrl: string
}
