export type FolderAddArgs = {
    name: string
    workspaceId: string
    childOrder?: number
    defaultOrder?: number
    addProjectIds?: string[]
}

export type FolderUpdateArgs = {
    id: string
    workspaceId: string
    name?: string
    addProjectIds?: string[]
    removeProjectIds?: string[]
}

export type FolderDeleteArgs = {
    id: string
    workspaceId: string
}
