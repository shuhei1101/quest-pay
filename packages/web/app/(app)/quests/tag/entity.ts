import { z } from "zod"

/** DBのクエストスキーマ */
export const QuestTagEntityScheme = z.object({
  quest_id: z.string(),
  name: z.string(),
})
export type QuestTagEntity = z.infer<typeof QuestTagEntityScheme>

// クエストのカラム名
export type QuestTagColumns = keyof QuestTagEntity
