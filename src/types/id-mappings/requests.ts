/** Object types that support ID mappings. */
export const ID_MAPPING_OBJECT_TYPES = [
    'sections',
    'tasks',
    'comments',
    'reminders',
    'location_reminders',
    'projects',
] as const
/** Object type that supports ID mappings. */
export type IdMappingObjectType = (typeof ID_MAPPING_OBJECT_TYPES)[number]

/** Object types that support moved ID lookups. */
export const MOVED_ID_OBJECT_TYPES = [
    'sections',
    'tasks',
    'comments',
    'reminders',
    'location_reminders',
] as const
/** Object type that supports moved ID lookups. */
export type MovedIdObjectType = (typeof MOVED_ID_OBJECT_TYPES)[number]

/**
 * Arguments for getting ID mappings between old and new IDs.
 * @see https://developer.todoist.com/api/v1/#tag/Ids/operation/id_mappings_api_v1_id_mappings__obj_name___obj_ids__get
 */
export type GetIdMappingsArgs = {
    /** The type of object to look up. */
    objName: IdMappingObjectType
    /** Array of IDs to look up. */
    objIds: [string, ...string[]]
}

/**
 * Arguments for getting moved IDs.
 * @see https://developer.todoist.com/api/v1/#tag/Ids/operation/moved_ids_api_v1_moved_ids__obj_name__get
 */
export type GetMovedIdsArgs = {
    /** The type of object to look up. */
    objName: MovedIdObjectType
    /** Array of old IDs to look up. */
    oldIds?: string[]
}
