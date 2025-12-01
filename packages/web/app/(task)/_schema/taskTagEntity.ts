import { z } from "zod"

/** DBのタスクスキーマ */
export const TaskTagEntitySchema = z.object({
  task_id: z.number(),
  name: z.string(),
})
export type TaskTagEntity = z.infer<typeof TaskTagEntitySchema>

// 更新用
export const TaskTagInsertSchema = TaskTagEntitySchema.omit({task_id: true})
export const TaskTagUpdateSchema = TaskTagEntitySchema.omit({})
export const TaskTagDeleteSchema = TaskTagEntitySchema.pick({task_id: true})
export type TaskTagInsert = z.infer<typeof TaskTagInsertSchema>
export type TaskTagUpdate = z.infer<typeof TaskTagUpdateSchema>
export type TaskTagDelete = z.infer<typeof TaskTagDeleteSchema>

// タスクのカラム名
export type TaskTagColumns = keyof TaskTagEntity
