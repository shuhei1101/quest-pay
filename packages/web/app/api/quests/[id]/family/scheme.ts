import { QuestEntityScheme } from "@/app/api/quests/entity"
import { z } from "zod"
import { FetchFamilyQuestResult } from "../../family/query"
import { FamilyQuestFormScheme } from "@/app/(app)/quests/child/[id]/form"

/** 家族クエスト取得レスポンススキーマ */
export const GetFamilyQuestResponseScheme = z.object({
  quest: FetchFamilyQuestResult
})
export type GetFamilyQuestResponse = z.infer<typeof GetFamilyQuestResponseScheme>

/** 家族クエスト更新リクエストスキーマ */
export const PutFamilyQuestRequestScheme = z.object({
  form: FamilyQuestFormScheme,
  questId: QuestEntityScheme.shape.id,
  updatedAt: QuestEntityScheme.shape.updated_at
})
export type PutFamilyQuestRequest = z.infer<typeof PutFamilyQuestRequestScheme>

/** 家族クエスト削除リクエストスキーマ */
export const DeleteFamilyQuestRequestScheme = z.object({
  questId: QuestEntityScheme.shape.id, 
  updatedAt: QuestEntityScheme.shape.updated_at
})
export type DeleteFamilyQuestRequest = z.infer<typeof DeleteFamilyQuestRequestScheme>
