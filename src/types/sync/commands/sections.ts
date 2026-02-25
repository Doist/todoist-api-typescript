export type SectionAddArgs = {
    projectId: string
    name: string
    sectionOrder?: number
    addedAt?: string
}

export type SectionUpdateArgs = {
    id: string
    name?: string
    isCollapsed?: boolean
}

export type SectionMoveArgs = {
    id: string
    projectId: string
}

export type SectionReorderArgs = {
    sections: Array<{ id: string; sectionOrder: number }>
}

export type SectionArchiveArgs = {
    id: string
    archivedAt?: string
}

export type SectionUnarchiveArgs = {
    id: string
}

export type SectionDeleteArgs = {
    id: string
}
