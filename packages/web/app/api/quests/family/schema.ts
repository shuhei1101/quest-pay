import { z } from "zod"
import { SortOrderSchema } from "@/app/(core)/schema"
import { FetchFamilyQuestsResult } from "./query"
import { QuestInsertSchema } from "@/app/api/quests/entity"
import { FamilyQuestInsertSchema } from "./entity"
import { QuestTagInsertSchema } from "@/app/(app)/quests/_schema/questTagEntity"
import { FamilyQuestColumnsSchema } from "./view"

/** クエストフィルター */
export const FamilyQuestFilterSchema = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
})
export type FamilyQuestFilterType = z.infer<typeof FamilyQuestFilterSchema>

/** クエスト検索パラメータ */
export const FamilyQuestSearchParamsSchema = FamilyQuestFilterSchema.extend({
  sortColumn: FamilyQuestColumnsSchema,
  sortOrder: SortOrderSchema,
}).extend({
  page: z.string().transform((val) => Number(val)),
  pageSize: z.string().transform((val) => Number(val))
})
export type FamilyQuestSearchParams = z.infer<typeof FamilyQuestSearchParamsSchema>

/** クエスト取得レスポンススキーマ */
export const QuestsFamilyGetResponseSchema = z.object({
  quests: FetchFamilyQuestsResult,
  totalRecords: z.number()
})
export type QuestsFamilyGetResponse = z.infer<typeof QuestsFamilyGetResponseSchema>

/** クエスト挿入リクエストスキーマ */
export const PostFamilyQuestRequestSchema = z.object({
  quest: QuestInsertSchema.omit({type: true}),
  familyQuest: FamilyQuestInsertSchema.omit({family_id: true}),
  tags: z.array(QuestTagInsertSchema)
})
export type PostFamilyQuestRequest = z.infer<typeof PostFamilyQuestRequestSchema>

/** クエスト挿入レスポンススキーマ */
export const PostFamilyQuestResponseSchema = z.object({
  questId: z.number()
})
export type PostFamilyQuestResponse = z.infer<typeof PostFamilyQuestResponseSchema>
