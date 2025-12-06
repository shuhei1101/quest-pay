import { z } from "zod"
import { SortOrderSchema } from "@/app/(core)/schema"
import { QuestTagInsertSchema } from "../../(app)/quests/_schema/questTagEntity"
import { QuestColumnsSchema, QuestInsertSchema } from "./entity"
import { FetchFamilyQuestsResult } from "./family/query"

/** クエストフィルター */
export const QuestFilterSchema = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
})
export type QuestFilterType = z.infer<typeof QuestFilterSchema>

/** クエスト検索パラメータ */
export const QuestSearchParamsSchema = QuestFilterSchema.extend({
  sortColumn: QuestColumnsSchema,
  sortOrder: SortOrderSchema,
}).extend({
  page: z.string().transform((val) => Number(val)),
  pageSize: z.string().transform((val) => Number(val))
})
export type QuestSearchParams = z.infer<typeof QuestSearchParamsSchema>

/** クエスト取得レスポンススキーマ */
export const QuestsGetResponseSchema = z.object({
  quests: FetchFamilyQuestsResult,
  totalRecords: z.number()
})
export type QuestsGetResponse = z.infer<typeof QuestsGetResponseSchema>


/** クエスト挿入リクエストスキーマ */
export const QuestsPostRequestSchema = z.object({
  quest: QuestInsertSchema,
  tags: z.array(QuestTagInsertSchema)
})
export type QuestsPostRequest = z.infer<typeof QuestsPostRequestSchema>
