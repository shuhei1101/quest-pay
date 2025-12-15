import { z } from "zod"

/** DBのクエストスキーマ */
export const QuestEntityScheme = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["template", "public", "family"]),
  created_at: z.string(),
  updated_at: z.string(),
  category_id: z.number().nullable(),
  icon_id: z.number(),
  icon_color: z.string()
})
export type QuestEntity = z.infer<typeof QuestEntityScheme>

// クエストのカラム名
const QuestColumnsArray = ["id", "name", "type", "icon_id", "created_at", "updated_at", "category_id"] as const
export const QuestColumnsScheme = z.enum(QuestColumnsArray)
export type QuestColumns = z.infer<typeof QuestColumnsScheme>
