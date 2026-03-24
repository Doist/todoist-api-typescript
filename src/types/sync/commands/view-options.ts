import type { ViewType, ViewMode, GroupedBy, SortedBy, SortOrder } from '../resources/view-options'

export type ViewOptionsSetArgs = {
    viewType: ViewType
    objectId?: string
    groupedBy?: GroupedBy | null
    filteredBy?: string | null
    viewMode?: ViewMode
    showCompletedTasks?: boolean
    sortedBy?: SortedBy | null
    sortOrder?: SortOrder | null
}

export type ViewOptionsDeleteArgs = {
    viewType: ViewType
    objectId?: string
}
