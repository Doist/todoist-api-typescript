import { z } from 'zod'

export const BackupSchema = z.object({
    version: z.string(),
    url: z.string(),
})
/** Represents a backup snapshot. */
export type Backup = z.infer<typeof BackupSchema>
