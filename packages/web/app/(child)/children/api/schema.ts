import { z } from "zod"
import { TaskFormSchema } from "../[id]/_schema/childFormSchema"

/** タスク登録リクエストスキーマ */
export const RegisterTaskRequestSchema = z.object({
  user_id: z.string(),
  form: TaskFormSchema,
})
export type RegisterTaskRequest = z.infer<typeof RegisterTaskRequestSchema>
/** タスク更新リクエストスキーマ */
export const UpdateTaskRequestSchema = z.object({
  user_id: z.string(),
  task_id: z.number(),
  form: TaskFormSchema,
  updated_at: z.string(),
})
export type UpdateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>
