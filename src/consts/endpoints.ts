const BASE_URI = 'https://api.todoist.com'
const TODOIST_URI = 'https://todoist.com'
export const TODOIST_WEB_URI = 'https://app.todoist.com/app'

// The API version is not configurable, to ensure
// compatibility between the API and the client.
export const API_VERSION = 'v1'

export const API_BASE_URI = `/api/${API_VERSION}/`
const API_AUTHORIZATION_BASE_URI = '/oauth/'

export function getSyncBaseUri(domainBase: string = BASE_URI): string {
    return new URL(API_BASE_URI, domainBase).toString()
}

export function getAuthBaseUri(domainBase: string = TODOIST_URI): string {
    return new URL(API_AUTHORIZATION_BASE_URI, domainBase).toString()
}

export const ENDPOINT_REST_TASKS = 'tasks'
export const ENDPOINT_REST_TASKS_FILTER = ENDPOINT_REST_TASKS + '/filter'
export const ENDPOINT_REST_TASKS_COMPLETED_BY_COMPLETION_DATE =
    ENDPOINT_REST_TASKS + '/completed/by_completion_date'
export const ENDPOINT_REST_TASKS_COMPLETED_BY_DUE_DATE =
    ENDPOINT_REST_TASKS + '/completed/by_due_date'
export const ENDPOINT_REST_SECTIONS = 'sections'
export const ENDPOINT_REST_LABELS = 'labels'
export const ENDPOINT_REST_LABELS_SHARED = ENDPOINT_REST_LABELS + '/shared'
export const ENDPOINT_REST_LABELS_SHARED_RENAME = ENDPOINT_REST_LABELS_SHARED + '/rename'
export const ENDPOINT_REST_LABELS_SHARED_REMOVE = ENDPOINT_REST_LABELS_SHARED + '/remove'
export const ENDPOINT_REST_COMMENTS = 'comments'
export const ENDPOINT_REST_TASK_CLOSE = 'close'
export const ENDPOINT_REST_TASK_REOPEN = 'reopen'
export const ENDPOINT_REST_PROJECTS = 'projects'
export const ENDPOINT_REST_PROJECTS_ARCHIVED = ENDPOINT_REST_PROJECTS + '/archived'
export const ENDPOINT_REST_PROJECT_COLLABORATORS = 'collaborators'
export const ENDPOINT_REST_USER = 'user'
export const PROJECT_ARCHIVE = 'archive'
export const PROJECT_UNARCHIVE = 'unarchive'

export const ENDPOINT_SYNC_QUICK_ADD = ENDPOINT_REST_TASKS + '/quick'

export const ENDPOINT_SYNC = 'sync'

export const ENDPOINT_AUTHORIZATION = 'authorize'
export const ENDPOINT_GET_TOKEN = 'access_token'
export const ENDPOINT_REVOKE_TOKEN = 'access_tokens/revoke'
