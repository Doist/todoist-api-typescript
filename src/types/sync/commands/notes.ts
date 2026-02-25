export type NoteAddArgs = {
    itemId?: string
    projectId?: string
    content?: string
    fileAttachment?: unknown
    uidsToNotify?: string[]
    postedAt: string
}

export type NoteUpdateArgs = {
    itemId?: string
    projectId?: string
    content?: string
    fileAttachment?: unknown
    uidsToNotify?: string[]
}

export type NoteDeleteArgs = {
    id: string
}

export type NoteReactionAddArgs = {
    id: string
    reaction: string
}

export type NoteReactionRemoveArgs = {
    id: string
    reaction: string
}
