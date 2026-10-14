import { z } from 'zod'

/**
 * Scope of a status effect. `mode` stays a plain string and `scope` optional so
 * that a mode or an effect shape added by another client does not break parsing.
 */
export const UserStatusEffectSchema = z.looseObject({
    scope: z.looseObject({ mode: z.string() }).optional(),
})

export type UserStatusEffect = z.infer<typeof UserStatusEffectSchema>

export const UserStatusEffectsSchema = z.looseObject({
    pauseNotifications: UserStatusEffectSchema.optional(),
    pauseActivity: UserStatusEffectSchema.optional(),
})

export type UserStatusEffects = z.infer<typeof UserStatusEffectsSchema>

/**
 * A user's status, shared across Todoist and Comms. The API returns `null` in its place
 * when the user has no status or it has expired.
 */
export const UserStatusSchema = z.looseObject({
    message: z.string(),
    emoji: z.string().nullish(),
    activeUntil: z.coerce.date().nullish(),
    effects: UserStatusEffectsSchema,
})

export type UserStatus = z.infer<typeof UserStatusSchema>
