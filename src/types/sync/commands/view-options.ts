export type ViewType =
    | 'TODAY'
    | 'UPCOMING'
    | 'PROJECT'
    | 'LABEL'
    | 'FILTER'
    | 'WORKSPACE_FILTER'
    | 'SEARCH'
    | 'TEMPLATE_PREVIEW'
    | 'TASK_DETAIL'
    | 'AUTOMATION'
    | 'ASSIGNED'
    | 'OVERDUE'
    | 'WORKSPACE_OVERVIEW'

export type ViewMode = 'LIST' | 'BOARD' | 'CALENDAR'

export type GroupedBy =
    | null
    | 'ASSIGNEE'
    | 'ADDED_DATE'
    | 'DUE_DATE'
    | 'DEADLINE'
    | 'LABEL'
    | 'PRIORITY'
    | 'PROJECT'
    | 'WORKSPACE'

export type SortedBy =
    | null
    | 'MANUAL'
    | 'ALPHABETICALLY'
    | 'ASSIGNEE'
    | 'DUE_DATE'
    | 'DEADLINE'
    | 'ADDED_DATE'
    | 'PRIORITY'
    | 'PROJECT'
    | 'WORKSPACE'

export type SortOrder = 'ASC' | 'DESC'

export type ViewOptionsSetArgs = {
    viewType: ViewType
    objectId?: string
    groupedBy?: GroupedBy
    filteredBy?: string | null
    viewMode?: ViewMode
    showCompletedTasks?: boolean
    sortedBy?: SortedBy
    sortOrder?: SortOrder | null
}

export type ViewOptionsDeleteArgs = {
    viewType: ViewType
    objectId?: string
}
