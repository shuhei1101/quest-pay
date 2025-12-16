import { z } from "zod"
import { SortOrderScheme } from "@/app/(core)/scheme"
import { FetchFamilyQuestsResult } from "./query"
import { FamilyQuestEntityScheme } from "./entity"
import { FamilyQuestColumnsScheme } from "./view"
import { FamilyQuestFormScheme } from "@/app/(app)/quests/parent/[id]/form"

/** 家族クエストフィルター */
export const FamilyQuestFilterScheme = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
})
export type FamilyQuestFilterType = z.infer<typeof FamilyQuestFilterScheme>

/** 家族クエスト検索パラメータ */
export const FamilyQuestSearchParamsScheme = FamilyQuestFilterScheme.extend({
  sortColumn: FamilyQuestColumnsScheme,
  sortOrder: SortOrderScheme,
}).extend({
  page: z.string().transform((val) => Number(val)),
  pageSize: z.string().transform((val) => Number(val))
})
export type FamilyQuestSearchParams = z.infer<typeof FamilyQuestSearchParamsScheme>

/** 家族クエスト取得レスポンススキーマ */
export const GetFamilyQuestsResponseScheme = z.object({
  quests: FetchFamilyQuestsResult,
  totalRecords: z.number()
})
export type GetFamilyQuestsResponse = z.infer<typeof GetFamilyQuestsResponseScheme>

/** 家族クエスト挿入リクエストスキーマ */
export const PostFamilyQuestRequestScheme = z.object({
  form: FamilyQuestFormScheme
})
export type PostFamilyQuestRequest = z.infer<typeof PostFamilyQuestRequestScheme>

/** 家族クエスト挿入レスポンススキーマ */
export const PostFamilyQuestResponseScheme = z.object({
  questId: FamilyQuestEntityScheme.shape.quest_id
})
export type PostFamilyQuestResponse = z.infer<typeof PostFamilyQuestResponseScheme>
