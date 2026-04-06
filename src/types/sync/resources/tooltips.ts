import { z } from 'zod'

export const TooltipsSchema = z.looseObject({
    seen: z.array(z.string()).optional(),
    scheduled: z.array(z.string()).optional(),
})

export type Tooltips = z.infer<typeof TooltipsSchema>
