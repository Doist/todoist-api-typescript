import { z } from 'zod'
import {
    WorkspaceRoleSchema,
    WorkspacePlanSchema,
    WorkspaceLimitsSchema,
    WorkspacePropertiesSchema,
} from '../../workspaces/types'

/**
 * Coerces a string or number value to a string.
 * The REST API returns numeric IDs while the Sync API returns string IDs.
 */
const stringOrNumber = z
    .union([z.string(), z.number()])
    .transform((val) => String(val))

/**
 * Sync API workspace resource.
 *
 * This is a superset of the REST `WorkspaceSchema` — the Sync API returns
 * additional fields like description, isDeleted, isCollapsed, member counts,
 * domain settings, and sorting preferences.
 */
export const SyncWorkspaceSchema = z
    .object({
        id: stringOrNumber,
        name: z.string(),
        description: z.string(),
        logoBig: z.string().optional(),
        logoMedium: z.string().optional(),
        logoSmall: z.string().optional(),
        logoS640: z.string().optional(),
        creatorId: stringOrNumber,
        createdAt: z.string().optional(),
        dateCreated: z.string().optional(),
        isDeleted: z.boolean(),
        isCollapsed: z.boolean(),
        role: WorkspaceRoleSchema,
        plan: WorkspacePlanSchema,
        limits: WorkspaceLimitsSchema,
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
        domainName: z.string().optional(),
        domainDiscovery: z.boolean().optional(),
        restrictEmailDomains: z.boolean().optional(),
        adminSortingApplied: z.boolean(),
        projectSortPreference: z.string().optional(),
        defaultCollaborators: z
            .object({
                predefinedGroupIds: z.array(z.string()),
                userIds: z.array(z.number()),
            })
            .optional(),
        properties: WorkspacePropertiesSchema.optional(),
    })
    .passthrough()

export type SyncWorkspace = z.infer<typeof SyncWorkspaceSchema>
