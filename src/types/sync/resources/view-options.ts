import { z } from 'zod'

const ViewTypeSchema = z.enum([
    'TODAY',
    'UPCOMING',
    'PROJECT',
    'LABEL',
    'FILTER',
    'WORKSPACE_FILTER',
    'SEARCH',
    'TEMPLATE_PREVIEW',
    'TASK_DETAIL',
    'AUTOMATION',
    'ASSIGNED',
    'OVERDUE',
    'WORKSPACE_OVERVIEW',
])

const ViewModeSchema = z.enum(['LIST', 'BOARD', 'CALENDAR'])

const GroupedBySchema = z
    .enum([
        'ASSIGNEE',
        'ADDED_DATE',
        'DUE_DATE',
        'DEADLINE',
        'LABEL',
        'PRIORITY',
        'PROJECT',
        'WORKSPACE',
    ])
    .nullable()

const SortedBySchema = z
    .enum([
        'MANUAL',
        'ALPHABETICALLY',
        'ASSIGNEE',
        'DUE_DATE',
        'DEADLINE',
        'ADDED_DATE',
        'PRIORITY',
        'PROJECT',
        'WORKSPACE',
    ])
    .nullable()

const SortOrderSchema = z.enum(['ASC', 'DESC']).nullable()

const CalendarSettingsSchema = z
    .object({
        layout: z.enum(['WEEK', 'MONTH']).optional(),
    })
    .passthrough()

export const ViewOptionsSchema = z
    .object({
        viewType: ViewTypeSchema,
        objectId: z.string().optional(),
        groupedBy: GroupedBySchema.optional(),
        filteredBy: z.string().nullable().optional(),
        viewMode: ViewModeSchema.optional(),
        showCompletedTasks: z.boolean().optional(),
        sortedBy: SortedBySchema.optional(),
        sortOrder: SortOrderSchema.optional(),
    })
    .passthrough()

export type ViewOptions = z.infer<typeof ViewOptionsSchema>

export const ProjectViewOptionsDefaultsSchema = z
    .object({
        projectId: z.string(),
        viewMode: ViewModeSchema.nullable().optional(),
        groupedBy: GroupedBySchema.optional(),
        sortedBy: SortedBySchema.optional(),
        sortOrder: SortOrderSchema.optional(),
        showCompletedTasks: z.boolean().optional(),
        filteredBy: z.string().nullable().optional(),
        calendarSettings: CalendarSettingsSchema.nullable().optional(),
    })
    .passthrough()

export type ProjectViewOptionsDefaults = z.infer<typeof ProjectViewOptionsDefaultsSchema>
