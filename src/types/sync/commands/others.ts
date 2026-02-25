export type UserUpdateArgs = Record<string, unknown>

export type DeleteCollaboratorArgs = {
    projectId: string
    email: string
}

export type IdMappingArgs = {
    items?: Record<string, string>
    sections?: Record<string, string>
    notes?: Record<string, string>
    reminders?: Record<string, string>
}

export type SuggestionDeleteArgs = {
    type: 'templates'
}
