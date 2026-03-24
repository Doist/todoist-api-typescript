import { z } from 'zod'

export const VIEW_TYPES = [
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
] as const
export type ViewType = (typeof VIEW_TYPES)[number]

export const ViewTypeSchema = z.enum(VIEW_TYPES)

export const VIEW_MODES = ['LIST', 'BOARD', 'CALENDAR'] as const
export type ViewMode = (typeof VIEW_MODES)[number]

export const ViewModeSchema = z.enum(VIEW_MODES)

export const GROUPED_BY_OPTIONS = [
    'ASSIGNEE',
    'ADDED_DATE',
    'DUE_DATE',
    'DEADLINE',
    'LABEL',
    'PRIORITY',
    'PROJECT',
    'WORKSPACE',
] as const
export type GroupedBy = (typeof GROUPED_BY_OPTIONS)[number]

export const GroupedBySchema = z.enum(GROUPED_BY_OPTIONS).nullable()

export const SORTED_BY_OPTIONS = [
    'MANUAL',
    'ALPHABETICALLY',
    'ASSIGNEE',
    'DUE_DATE',
    'DEADLINE',
    'ADDED_DATE',
    'PRIORITY',
    'PROJECT',
    'WORKSPACE',
] as const
export type SortedBy = (typeof SORTED_BY_OPTIONS)[number]

export const SortedBySchema = z.enum(SORTED_BY_OPTIONS).nullable()

export const SORT_ORDERS = ['ASC', 'DESC'] as const
export type SortOrder = (typeof SORT_ORDERS)[number]

export const SortOrderSchema = z.enum(SORT_ORDERS).nullable()

export const CALENDAR_LAYOUTS = ['WEEK', 'MONTH'] as const
export type CalendarLayout = (typeof CALENDAR_LAYOUTS)[number]

export const CalendarSettingsSchema = z
    .object({
        layout: z.enum(CALENDAR_LAYOUTS).optional(),
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
