import type {
    ViewMode,
    GroupedBy,
    SortedBy,
    SortOrder,
    CalendarLayout,
} from '../resources/view-options'

export type CalendarSettings = {
    layout?: CalendarLayout
}

export type ProjectViewOptionsDefaultsSetArgs = {
    projectId: string
    viewMode?: ViewMode | null
    groupedBy?: GroupedBy | null
    sortedBy?: SortedBy | null
    sortOrder?: SortOrder | null
    showCompletedTasks?: boolean
    filteredBy?: string | null
    calendarSettings?: CalendarSettings | null
}
