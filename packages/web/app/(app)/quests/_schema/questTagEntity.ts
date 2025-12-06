import { z } from "zod"

/** DBのクエストスキーマ */
export const QuestTagEntitySchema = z.object({
  quest_id: z.number(),
  name: z.string(),
})
export type QuestTagEntity = z.infer<typeof QuestTagEntitySchema>

// 更新用
export const QuestTagInsertSchema = QuestTagEntitySchema.omit({quest_id: true})
export const QuestTagUpdateSchema = QuestTagEntitySchema.omit({quest_id: true})
export const QuestTagDeleteSchema = QuestTagEntitySchema.pick({})
export type QuestTagInsert = z.infer<typeof QuestTagInsertSchema>
export type QuestTagUpdate = z.infer<typeof QuestTagUpdateSchema>
export type QuestTagDelete = z.infer<typeof QuestTagDeleteSchema>

// クエストのカラム名
export type QuestTagColumns = keyof QuestTagEntity
