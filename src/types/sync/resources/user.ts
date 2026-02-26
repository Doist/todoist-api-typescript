import { z } from 'zod'
import { DateFormatSchema, DayOfWeekSchema, TimeFormatSchema } from '../user-preferences'

const FeaturesSchema = z
    .object({
        karmaDisabled: z.boolean(),
        restriction: z.number().int(),
        karmaVacation: z.boolean(),
        dateistLang: z.any(),
        beta: z.union([z.literal(0), z.literal(1)]),
        hasPushReminders: z.boolean(),
        dateistInlineDisabled: z.boolean(),
        autoInviteDisabled: z.boolean().optional(),
        goldTheme: z.boolean().optional(),
        migratedFromTdb: z.boolean().optional(),
    })
    .passthrough()

const TzInfoSchema = z
    .object({
        timezone: z.string(),
        hours: z.number().int(),
        minutes: z.number().int(),
        isDst: z.union([z.literal(0), z.literal(1)]),
        gmtString: z.string(),
    })
    .passthrough()

const JoinableWorkspaceSchema = z
    .object({
        workspaceId: z.string(),
        workspaceName: z.string(),
        memberCount: z.number().int(),
    })
    .passthrough()

const GettingStartedGuideProjectSchema = z
    .object({
        onboardingUseCase: z.string(),
        projectId: z.string(),
        completed: z.boolean(),
        closed: z.boolean(),
    })
    .passthrough()

/**
 * Sync API user resource.
 *
 * This is a superset of the REST `CurrentUserSchema` — the Sync API returns
 * many additional fields for features, onboarding state, and account details.
 */
export const SyncUserSchema = z
    .object({
        id: z.string(),
        email: z.string(),
        fullName: z.string(),
        activatedUser: z.boolean(),
        autoReminder: z.number().int(),
        avatarBig: z.string().optional(),
        avatarMedium: z.string().optional(),
        avatarS640: z.string().optional(),
        avatarSmall: z.string().optional(),
        businessAccountId: z.string().nullable(),
        dailyGoal: z.number().int(),
        dateFormat: DateFormatSchema,
        dateistLang: z.string().nullable(),
        daysOff: z.array(z.number().int()),
        featureIdentifier: z.string(),
        features: FeaturesSchema,
        freeTrailExpires: z.string().optional(),
        hasMagicNumber: z.boolean(),
        hasPassword: z.boolean(),
        hasStartedATrial: z.boolean().optional(),
        imageId: z.string().nullable(),
        inboxProjectId: z.string(),
        isCelebrationsEnabled: z.boolean(),
        isPremium: z.boolean(),
        joinableWorkspace: JoinableWorkspaceSchema.nullable(),
        joinedAt: z.string(),
        gettingStartedGuideProjects: z.array(GettingStartedGuideProjectSchema).nullable(),
        karma: z.number(),
        karmaTrend: z.string(),
        lang: z.string(),
        mfaEnabled: z.boolean().optional(),
        mobileHost: z.string().nullable(),
        mobileNumber: z.string().nullable(),
        nextWeek: DayOfWeekSchema,
        onboardingLevel: z.string().nullable().optional(),
        onboardingRole: z.string().nullable().optional(),
        onboardingPersona: z.string().nullable().optional(),
        onboardingInitiated: z.boolean().nullable().optional(),
        onboardingCompleted: z.boolean().nullable().optional(),
        onboardingSkipped: z.boolean().optional(),
        onboardingTeamMode: z.boolean().nullable().optional(),
        onboardingUseCases: z.array(z.string()).nullable().optional(),
        premiumStatus: z.enum([
            'not_premium',
            'current_personal_plan',
            'legacy_personal_plan',
            'teams_business_member',
        ]),
        premiumUntil: z.string().nullable(),
        rambleSessionsUsage: z
            .object({
                currentCount: z.number().int(),
                limit: z.number().int(),
                remaining: z.number().int(),
                resetDate: z.string(),
            })
            .nullable()
            .optional(),
        shareLimit: z.number().int(),
        sortOrder: z.number().int(),
        startDay: DayOfWeekSchema,
        startPage: z.string(),
        themeId: z.string(),
        timeFormat: TimeFormatSchema,
        token: z.string(),
        tzInfo: TzInfoSchema,
        uniquePrefix: z.number().int(),
        verificationStatus: z.string(),
        websocketUrl: z.string(),
        weekendStartDay: z.number().int(),
        weeklyGoal: z.number().int(),
    })
    .passthrough()

export type SyncUser = z.infer<typeof SyncUserSchema>
