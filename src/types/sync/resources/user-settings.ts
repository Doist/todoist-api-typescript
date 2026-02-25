import { z } from 'zod'

const NavigationFeatureSchema = z.object({
    name: z.string(),
    shown: z.boolean(),
})

const QuickAddFeatureSchema = z.object({
    name: z.string(),
    shown: z.boolean(),
})

/**
 * Sync API user settings resource.
 */
export const UserSettingsSchema = z
    .object({
        completedSoundDesktop: z.boolean(),
        completedSoundMobile: z.boolean(),
        debugLogSendingEnabledUntil: z.string().nullable(),
        legacyPricing: z.boolean(),
        navigation: z
            .object({
                countsShown: z.boolean(),
                features: z.array(NavigationFeatureSchema),
            })
            .passthrough(),
        reminderDesktop: z.boolean(),
        reminderEmail: z.boolean(),
        reminderPush: z.boolean(),
        resetRecurringSubtasks: z.boolean(),
        aiEmailAssist: z.boolean(),
        theme: z.string().nullable().optional(),
        syncTheme: z.boolean().optional(),
        quickAdd: z
            .object({
                labelsShown: z.boolean(),
                features: z.array(QuickAddFeatureSchema),
            })
            .passthrough(),
    })
    .passthrough()

export type UserSettings = z.infer<typeof UserSettingsSchema>
