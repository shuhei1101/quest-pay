import { z } from "zod"

/** DBのクエストカテゴリスキーマ */
export const QuestCategoryEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  icon_name: z.string(),
  icon_size: z.number(),
  sort_order: z.number(),
})
export type QuestCategoryEntity = z.infer<typeof QuestCategoryEntitySchema>
