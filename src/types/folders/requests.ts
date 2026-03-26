import type { Folder } from '../sync/resources/folders'

export type GetFoldersArgs = {
    workspaceId: number
    cursor?: string | null
    limit?: number
}

export type GetFoldersResponse = {
    results: Folder[]
    nextCursor: string | null
}

export type AddFolderArgs = {
    name: string
    workspaceId: number
    defaultOrder?: number | null
    childOrder?: number | null
}

export type UpdateFolderArgs = {
    name?: string | null
    defaultOrder?: number | null
}
