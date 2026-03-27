import { z } from 'zod'
import { getSectionUrl } from '../../utils/url-helpers'

export const SectionSchema = z
    .object({
        id: z.string(),
        userId: z.string(),
        projectId: z.string(),
        addedAt: z.string(),
        updatedAt: z.string(),
        archivedAt: z.string().nullable(),
        name: z.string(),
        sectionOrder: z.number().int(),
        isArchived: z.boolean(),
        isDeleted: z.boolean(),
        isCollapsed: z.boolean(),
    })
    .transform((data) => {
        return {
            ...data,
            url: getSectionUrl(data.id, data.name),
        }
    })
/**
 * Represents a section in a Todoist project.
 * @see https://developer.todoist.com/api/v1/#tag/Sections
 */
export type Section = z.infer<typeof SectionSchema>
