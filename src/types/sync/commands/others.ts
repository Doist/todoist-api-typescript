import type { DateFormat, DayOfWeek, TimeFormat } from '../user-preferences'

export type UserStatusEffectArgs = {
    scope?: { mode: string }
}

/** The complete status to set. It replaces any existing status. */
export type UserStatusArgs = {
    message: string
    emoji?: string
    /** Must be in the future; omit it for no expiry. A `Date` is sent as an ISO 8601 string. */
    activeUntil?: Date | string
    effects?: {
        pauseNotifications?: UserStatusEffectArgs
        pauseActivity?: UserStatusEffectArgs
    }
}

export type UserUpdateArgs = {
    fullName?: string
    autoReminder?: number
    dateFormat?: DateFormat
    nextWeek?: DayOfWeek
    startDay?: DayOfWeek
    startPage?: string
    themeId?: string
    timeFormat?: TimeFormat
    timezone?: string
    /** `null` clears the status; omitting it leaves the current status unchanged. */
    status?: UserStatusArgs | null
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
    ignoreDays?: DayOfWeek[]
    vacationMode?: boolean
    karmaDisabled?: boolean
}
