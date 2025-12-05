import { z } from "zod";

/** クエストステータスIDからステータス名を取得する */
export const getStatusName = (statuses: RawQuestStatus[], id?: number) => {
  return statuses.find(s => s.id === id)?.name
}

/** 取得時のステータススキーマ */
export const rawQuestStatus = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.string(),
})
export type RawQuestStatus = z.infer<typeof rawQuestStatus>
