import { z } from "zod"

/** タスクフィルター */
export const TaskFilterSchema = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
})
export type TaskFilterType = z.infer<typeof TaskFilterSchema>
