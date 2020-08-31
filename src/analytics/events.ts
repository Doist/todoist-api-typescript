export type AnalyticsEvent = {
    category: string
    action: string
    label?: string
}

export const addToInboxEvent: AnalyticsEvent = {
    category: 'ADD_TO_INBOX',
    action: 'TASK_ADDED',
}
