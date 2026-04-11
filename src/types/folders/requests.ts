import type { Folder } from '../sync/resources/folders'

export type GetFoldersArgs = {
    workspaceId: string
    cursor?: string | null
    limit?: number
}

export type GetFoldersResponse = {
    results: Folder[]
    nextCursor: string | null
}

export type AddFolderArgs = {
    name: string
    workspaceId: string
    defaultOrder?: number | null
    childOrder?: number | null
}

export type UpdateFolderArgs = {
    name?: string | null
    defaultOrder?: number | null
}
