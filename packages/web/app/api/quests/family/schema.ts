import { z } from "zod"
import { SortOrderSchema } from "@/app/(core)/schema"
import { FetchFamilyQuestsResult } from "./query"
import { QuestInsertSchema } from "@/app/api/quests/entity"
import { FamilyQuestEntitySchema, FamilyQuestInsertSchema } from "./entity"
import { QuestTagInsertSchema } from "@/app/(app)/quests/tag/entity"
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
export const GetFamilyQuestsResponseSchema = z.object({
  quests: FetchFamilyQuestsResult,
  totalRecords: z.number()
})
export type GetFamilyQuestsResponse = z.infer<typeof GetFamilyQuestsResponseSchema>

/** クエスト挿入リクエストスキーマ */
export const PostFamilyQuestRequestSchema = z.object({
  quest: QuestInsertSchema.omit({type: true}),
  familyQuest: FamilyQuestInsertSchema.omit({family_id: true}),
  tags: z.array(QuestTagInsertSchema)
})
export type PostFamilyQuestRequest = z.infer<typeof PostFamilyQuestRequestSchema>

/** クエスト挿入レスポンススキーマ */
export const PostFamilyQuestResponseSchema = z.object({
  questId: FamilyQuestEntitySchema.shape.quest_id
})
export type PostFamilyQuestResponse = z.infer<typeof PostFamilyQuestResponseSchema>
