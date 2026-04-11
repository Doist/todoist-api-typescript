import { z } from 'zod'

type SearchArgs = {
    query: string
    cursor?: string | null
    limit?: number
}

/**
 * Zod schema that accepts both string and number values and coerces to string.
 * The REST API returns numeric IDs while the Sync API returns string IDs.
 */
const StringOrNumberSchema = z.union([z.string(), z.number()]).transform((val) => String(val))

/**
 * Utility type for deprecated method overloads that still accept numeric workspace IDs.
 * Replaces `workspaceId: string` with `workspaceId: number`, preserving optionality and nullability.
 */
type WithNumberWorkspaceId<T> = {
    [K in keyof T]: K extends 'workspaceId' ? Exclude<T[K], string> | number : T[K]
}

export { StringOrNumberSchema }
export type { SearchArgs, WithNumberWorkspaceId }
