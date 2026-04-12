/**
 * Converts a native Fetch `Headers` object into a plain `Record<string, string>`.
 * Used when wrapping a native `fetch` response into the SDK's `FileResponse`
 * shape (which expects headers as a plain record for symmetry with
 * `CustomFetchResponse`).
 */
export function headersToRecord(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
        result[key] = value
    })
    return result
}
