const BASE_URI = 'https://api.todoist.com'
const API_REST_BASE_URI = '/rest/v2/'
const API_SYNC_BASE_URI = '/sync/v8/'
const TODOIST_URI = 'https://todoist.com'
const API_AUTHORIZATION_BASE_URI = '/oauth/'

export function getRestBaseUri(domainBase: string = BASE_URI): string {
    return new URL(API_REST_BASE_URI, domainBase).toString()
}

export function getSyncBaseUri(domainBase: string = BASE_URI): string {
    return new URL(API_SYNC_BASE_URI, domainBase).toString()
}

export function getAuthBaseUri(domainBase: string = TODOIST_URI): string {
    return new URL(API_AUTHORIZATION_BASE_URI, domainBase).toString()
}

export const ENDPOINT_REST_TASKS = 'tasks'
export const ENDPOINT_REST_PROJECTS = 'projects'
export const ENDPOINT_REST_SECTIONS = 'sections'
export const ENDPOINT_REST_LABELS = 'labels'
export const ENDPOINT_REST_LABELS_SHARED = ENDPOINT_REST_LABELS + '/shared'
export const ENDPOINT_REST_LABELS_SHARED_RENAME = ENDPOINT_REST_LABELS_SHARED + '/rename'
export const ENDPOINT_REST_LABELS_SHARED_REMOVE = ENDPOINT_REST_LABELS_SHARED + '/remove'
export const ENDPOINT_REST_COMMENTS = 'comments'
export const ENDPOINT_REST_TASK_CLOSE = 'close'
export const ENDPOINT_REST_TASK_REOPEN = 'reopen'
export const ENDPOINT_REST_PROJECT_COLLABORATORS = 'collaborators'

export const ENDPOINT_SYNC_QUICK_ADD = 'quick/add'

export const ENDPOINT_AUTHORIZATION = 'authorize'
export const ENDPOINT_GET_TOKEN = 'access_token'
export const ENDPOINT_REVOKE_TOKEN = 'access_tokens/revoke'
