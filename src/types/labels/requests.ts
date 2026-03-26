import type { ColorKey } from '../../utils/colors'
import type { SearchArgs } from '../common'
import type { Label } from './types'

/**
 * Arguments for retrieving labels.
 * @see https://developer.todoist.com/api/v1/#tag/Labels/operation/get_labels_api_v1_labels_get
 */
export type GetLabelsArgs = {
    cursor?: string | null
    limit?: number
}

/**
 * Arguments for searching labels.
 */
export type SearchLabelsArgs = SearchArgs

/**
 * Response from retrieving labels.
 * @see https://developer.todoist.com/api/v1/#tag/Labels/operation/get_labels_api_v1_labels_get
 */
export type GetLabelsResponse = {
    results: Label[]
    nextCursor: string | null
}

/**
 * Arguments for creating a new label.
 * @see https://developer.todoist.com/api/v1/#tag/Labels/operation/create_label_api_v1_labels_post
 */
export type AddLabelArgs = {
    name: string
    order?: number | null
    color?: ColorKey
    isFavorite?: boolean
}

/**
 * Arguments for updating a label.
 * @see https://developer.todoist.com/api/v1/#tag/Labels/operation/update_label_api_v1_labels__label_id__post
 */
export type UpdateLabelArgs = {
    name?: string
    order?: number | null
    color?: ColorKey
    isFavorite?: boolean
}

/**
 * Arguments for retrieving shared labels.
 * @see https://developer.todoist.com/api/v1/#tag/Labels/operation/shared_labels_api_v1_labels_shared_get
 */
export type GetSharedLabelsArgs = {
    omitPersonal?: boolean
    cursor?: string | null
    limit?: number
}

/**
 * Response from retrieving shared labels.
 * @see https://developer.todoist.com/api/v1/#tag/Labels/operation/shared_labels_api_v1_labels_shared_get
 */
export type GetSharedLabelsResponse = {
    results: string[]
    nextCursor: string | null
}

/**
 * Arguments for renaming a shared label.
 * @see https://developer.todoist.com/api/v1/#tag/Labels/operation/shared_labels_rename_api_v1_labels_shared_rename_post
 */
export type RenameSharedLabelArgs = {
    name: string
    newName: string
}

/**
 * Arguments for removing a shared label.
 * @see https://developer.todoist.com/api/v1/#tag/Labels/operation/shared_labels_remove_api_v1_labels_shared_remove_post
 */
export type RemoveSharedLabelArgs = {
    name: string
}
