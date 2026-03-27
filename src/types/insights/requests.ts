/** Known activity object types. Accepts any string for forward compatibility. */
export type InsightsObjectType = 'ITEM' | 'PROJECT' | 'NOTE' | (string & Record<string, never>)

/** Known activity event types. Accepts any string for forward compatibility. */
export type InsightsEventType =
    | 'ADDED'
    | 'DELETED'
    | 'UPDATED'
    | 'ARCHIVED'
    | 'UNARCHIVED'
    | 'COMPLETED'
    | 'UNCOMPLETED'
    | 'SHARED'
    | 'LEFT'
    | (string & Record<string, never>)

/**
 * Arguments for getting project activity stats.
 * @see https://developer.todoist.com/api/v1/#tag/Insights/operation/get_project_activity_stats_api_v1_projects__project_id__insights_activity_stats_get
 */
export type GetProjectActivityStatsArgs = {
    /** The type of object to get activity counts for (default: 'ITEM'). */
    objectType?: InsightsObjectType
    /** The type of event to count (default: 'COMPLETED'). */
    eventType?: InsightsEventType
    /** Number of weeks of activity counts to retrieve (1-12, default 2). */
    weeks?: number
    /** Whether to include weekly rollup counts in the response. */
    includeWeeklyCounts?: boolean
}

/**
 * Arguments for getting workspace insights.
 * @see https://developer.todoist.com/api/v1/#tag/Insights/operation/get_workspace_insights_api_v1_workspaces__workspace_id__insights_get
 */
export type GetWorkspaceInsightsArgs = {
    /** Project IDs to get insights for. */
    projectIds?: string[]
}
