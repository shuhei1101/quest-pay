import { z } from "zod"

/** DBのタスクスキーマ */
export const TaskEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(["template", "share", "family"]),
  icon: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type TaskEntity = z.infer<typeof TaskEntitySchema>

// 更新用
export const TaskInsertSchema = TaskEntitySchema.omit({id: true, created_at: true, updated_at: true})
export const TaskUpdateSchema = TaskEntitySchema.omit({created_at: true})
export const TaskDeleteSchema = TaskEntitySchema.pick({id: true, updated_at: true})
export type TaskInsert = z.infer<typeof TaskInsertSchema>
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>
export type TaskDelete = z.infer<typeof TaskDeleteSchema>

// タスクのカラム名
export type TaskColumns = keyof TaskEntity
