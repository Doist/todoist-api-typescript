import type { ViewMode, GroupedBy, SortedBy, SortOrder } from './view-options'

export type CalendarSettings = {
    layout?: 'WEEK' | 'MONTH'
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
