/**
 * Arguments for listing backups.
 * @see https://developer.todoist.com/api/v1/#tag/Backups/operation/get_backups_api_v1_backups_get
 */
export type GetBackupsArgs = {
    /** MFA token if required. Not needed when using an OAuth token with the `backups:read` scope. */
    mfaToken?: string | null
}

/**
 * Arguments for downloading a backup.
 * @see https://developer.todoist.com/api/v1/#tag/Backups/operation/download_backup_api_v1_backups_download_get
 */
export type DownloadBackupArgs = {
    /** The backup file URL. */
    file: string
}
