import type { DateFormat, DayOfWeek, TimeFormat } from '../user-preferences'

export type UserUpdateArgs = {
    fullName?: string
    autoReminder?: number
    /** 0 = DD/MM/YYYY, 1 = MM/DD/YYYY */
    dateFormat?: DateFormat
    /** 1 = Monday, 2 = Tuesday, ..., 7 = Sunday */
    nextWeek?: DayOfWeek
    /** 1 = Monday, 2 = Tuesday, ..., 7 = Sunday */
    startDay?: DayOfWeek
    startPage?: string
    themeId?: string
    /** 0 = 24-hour, 1 = 12-hour */
    timeFormat?: TimeFormat
    timezone?: string
}

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
