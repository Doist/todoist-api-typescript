import { z } from 'zod'
import { StringOrNumberSchema } from '../../common'
import {
    WorkspaceRoleSchema,
    WorkspacePlanSchema,
    WorkspaceLimitsSchema,
    WorkspacePropertiesSchema,
} from '../../workspaces/types'

/**
 * Sync API workspace resource.
 *
 * This is a superset of the REST `WorkspaceSchema` — the Sync API returns
 * additional fields like description, isDeleted, isCollapsed, member counts,
 * domain settings, and sorting preferences.
 */
export const SyncWorkspaceSchema = z
    .looseObject({
        id: StringOrNumberSchema,
        name: z.string(),
        description: z.string(),
        logoBig: z.string().nullish(),
        logoMedium: z.string().nullish(),
        logoSmall: z.string().nullish(),
        logoS640: z.string().nullish(),
        creatorId: StringOrNumberSchema,
        createdAt: z.coerce.date().optional(),
        dateCreated: z.coerce.date().optional(),
        isDeleted: z.boolean(),
        isCollapsed: z.boolean(),
        role: WorkspaceRoleSchema.optional(),
        plan: WorkspacePlanSchema,
        limits: WorkspaceLimitsSchema.optional(),
        inviteCode: z.string().nullable().optional(),
        isLinkSharingEnabled: z.boolean().nullable().optional(),
        isGuestAllowed: z.boolean().nullable().optional(),
        currentActiveProjects: z.number().nullable(),
        currentMemberCount: z.number().nullable(),
        memberCountByType: z
            .object({
                adminCount: z.number().int(),
                guestCount: z.number().int(),
                memberCount: z.number().int(),
            })
            .optional(),
        currentTemplateCount: z.number().nullable(),
        pendingInvitations: z.array(z.string()).nullable().optional(),
        domainName: z.string().nullish(),
        domainDiscovery: z.boolean().nullish(),
        restrictEmailDomains: z.boolean().nullish(),
        adminSortingApplied: z.boolean(),
        projectSortPreference: z.string().nullish(),
        defaultCollaborators: z
            .object({
                predefinedGroupIds: z.array(z.string()),
                userIds: z.array(StringOrNumberSchema),
            })
            .optional(),
        properties: WorkspacePropertiesSchema.optional(),
    })
    .transform(({ dateCreated, createdAt, ...rest }) => ({
        ...rest,
        createdAt: createdAt ?? dateCreated,
    }))

export type SyncWorkspace = z.infer<typeof SyncWorkspaceSchema>
