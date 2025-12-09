import { z } from "zod"

/** DBのクエストスキーマ */
export const QuestEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["template", "public", "family"]),
  created_at: z.string(),
  updated_at: z.string(),
  category_id: z.number().nullable(),
  icon_id: z.number(),
  icon_color: z.string()
})
export type QuestEntity = z.infer<typeof QuestEntitySchema>

// 更新用
export const QuestInsertSchema = QuestEntitySchema.omit({id: true, created_at: true, updated_at: true})
export const QuestUpdateSchema = QuestEntitySchema.omit({created_at: true})
export const QuestDeleteSchema = QuestEntitySchema.pick({id: true, updated_at: true})
export type QuestInsert = z.infer<typeof QuestInsertSchema>
export type QuestUpdate = z.infer<typeof QuestUpdateSchema>
export type QuestDelete = z.infer<typeof QuestDeleteSchema>

// クエストのカラム名
const QuestColumnsArray = ["id", "name", "type", "icon_id", "created_at", "updated_at", "category_id"] as const
export const QuestColumnsSchema = z.enum(QuestColumnsArray)
export type QuestColumns = z.infer<typeof QuestColumnsSchema>
