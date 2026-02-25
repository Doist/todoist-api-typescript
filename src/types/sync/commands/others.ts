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

export type UserSettingsUpdateArgs = {
    reminderPush?: boolean
    reminderDesktop?: boolean
    reminderEmail?: boolean
    completedSoundDesktop?: boolean
    completedSoundMobile?: boolean
}

export type UpdateGoalsArgs = {
    dailyGoal?: number
    weeklyGoal?: number
    ignoreDays?: number[]
    vacationMode?: 0 | 1
    karmaDisabled?: 0 | 1
}
