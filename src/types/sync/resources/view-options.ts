import { z } from 'zod'

/** Available view types. */
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
/** Type of view in the Todoist UI. */
export type ViewType = (typeof VIEW_TYPES)[number]

export const ViewTypeSchema = z.enum(VIEW_TYPES)

/** Available view modes. */
export const VIEW_MODES = ['LIST', 'BOARD', 'CALENDAR'] as const
/** Display mode for a view. */
export type ViewMode = (typeof VIEW_MODES)[number]

export const ViewModeSchema = z.enum(VIEW_MODES)

/** Available grouping options. */
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
/** Field to group tasks by. */
export type GroupedBy = (typeof GROUPED_BY_OPTIONS)[number]

export const GroupedBySchema = z.enum(GROUPED_BY_OPTIONS).nullable()

/** Available sorting options. */
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
/** Field to sort tasks by. */
export type SortedBy = (typeof SORTED_BY_OPTIONS)[number]

export const SortedBySchema = z.enum(SORTED_BY_OPTIONS).nullable()

/** Available sort directions. */
export const SORT_ORDERS = ['ASC', 'DESC'] as const
/** Sort direction. */
export type SortOrder = (typeof SORT_ORDERS)[number]

export const SortOrderSchema = z.enum(SORT_ORDERS).nullable()

/** Available calendar layout modes. */
export const CALENDAR_LAYOUTS = ['WEEK', 'MONTH'] as const
/** Calendar layout mode. */
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
