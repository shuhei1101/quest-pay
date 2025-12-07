import { QuestDeleteSchema, QuestUpdateSchema } from "@/app/api/quests/entity"
import { QuestTagUpdateSchema } from "@/app/(app)/quests/tag/entity"
import { z } from "zod"
import { FamilyQuestUpdateSchema } from "../../family/entity"
import { FetchFamilyQuestResult } from "../../family/query"

/** 家族クエスト取得レスポンススキーマ */
export const GetFamilyQuestResponseSchema = z.object({
  quest: FetchFamilyQuestResult
})
export type GetFamilyQuestResponse = z.infer<typeof GetFamilyQuestResponseSchema>

/** 家族クエスト更新リクエストスキーマ */
export const PutFamilyQuestRequestSchema = z.object({
  quest: QuestUpdateSchema.omit({type: true}),
  tags: z.array(QuestTagUpdateSchema),
  family_quest: FamilyQuestUpdateSchema.omit({family_id: true})
})
export type PutFamilyQuestRequest = z.infer<typeof PutFamilyQuestRequestSchema>

/** 家族クエスト削除リクエストスキーマ */
export const DeleteFamilyQuestRequestSchema = z.object({
  quest: QuestDeleteSchema,
})
export type DeleteFamilyQuestRequest = z.infer<typeof DeleteFamilyQuestRequestSchema>
