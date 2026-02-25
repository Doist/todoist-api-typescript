import { z } from 'zod'

export const TooltipsSchema = z
    .object({
        seen: z.array(z.string()).optional(),
        scheduled: z.array(z.string()).optional(),
    })
    .passthrough()

export type Tooltips = z.infer<typeof TooltipsSchema>
