import type { RequireExactlyOne } from 'type-fest'
import type { Comment } from './types'

/**
 * Arguments for retrieving comments.
 * @see https://developer.todoist.com/api/v1/#tag/Comments/operation/get_comments_api_v1_comments_get
 */
export type GetCommentsArgs = {
    taskId: string
    projectId?: never
    cursor?: string | null
    limit?: number
}

/**
 * Arguments for retrieving task comments.
 * @see https://developer.todoist.com/api/v1/#tag/Comments/operation/get_comments_api_v1_comments_get
 */
export type GetTaskCommentsArgs = {
    taskId: string
    projectId?: never
    cursor?: string | null
    limit?: number
}

/**
 * Arguments for retrieving project comments.
 * @see https://developer.todoist.com/api/v1/#tag/Comments/operation/get_comments_api_v1_comments_get
 */
export type GetProjectCommentsArgs = {
    projectId: string
    taskId?: never
    cursor?: string | null
    limit?: number
}

/**
 * Response from retrieving comments.
 * @see https://developer.todoist.com/api/v1/#tag/Comments/operation/get_comments_api_v1_comments_get
 */
export type GetCommentsResponse = {
    results: Comment[]
    nextCursor: string | null
}

/**
 * Arguments for creating a new comment.
 * @see https://developer.todoist.com/api/v1/#tag/Comments/operation/create_comment_api_v1_comments_post
 */
export type AddCommentArgs = {
    content: string
    attachment?: {
        fileName?: string
        fileUrl: string
        fileType?: string
        resourceType?: string
    } | null
    uidsToNotify?: string[]
} & RequireExactlyOne<{
    taskId?: string
    projectId?: string
}>

/**
 * Arguments for updating a comment.
 * @see https://developer.todoist.com/api/v1/#tag/Comments/operation/update_comment_api_v1_comments__comment_id__post
 */
export type UpdateCommentArgs = {
    content: string
}
