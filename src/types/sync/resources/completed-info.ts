import { z } from 'zod'

export const CompletedProjectMetadataSchema = z.looseObject({
    projectId: z.string(),
    archivedSections: z.number().int(),
    completedItems: z.number().int(),
})

export type CompletedProjectMetadata = z.infer<typeof CompletedProjectMetadataSchema>

export const CompletedSectionMetadataSchema = z.looseObject({
    sectionId: z.string(),
    id: z.string(),
    completedItems: z.number().int(),
})

export type CompletedSectionMetadata = z.infer<typeof CompletedSectionMetadataSchema>

export const CompletedTaskMetadataSchema = z.looseObject({
    itemId: z.string(),
    id: z.string().optional(),
    completedItems: z.number().int(),
})

export type CompletedTaskMetadata = z.infer<typeof CompletedTaskMetadataSchema>

export const CompletedInfoSchema = z.union([
    CompletedProjectMetadataSchema,
    CompletedSectionMetadataSchema,
    CompletedTaskMetadataSchema,
])

export type CompletedInfo = z.infer<typeof CompletedInfoSchema>
