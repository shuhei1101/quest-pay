import { z } from "zod";

/** タスクステータスIDからステータス名を取得する */
export const getStatusName = (statuses: RawTaskStatus[], id?: number) => {
  return statuses.find(s => s.id === id)?.name
}

/** 取得時のステータススキーマ */
export const rawTaskStatus = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.string(),
})
export type RawTaskStatus = z.infer<typeof rawTaskStatus>
