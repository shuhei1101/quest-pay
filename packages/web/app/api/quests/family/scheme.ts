import { z } from "zod"
import { SortOrderScheme } from "@/app/(core)/schema"
import { FamilyQuestFormScheme } from "@/app/(app)/quests/parent/[id]/form"
import { FamilyQuestSelectSchema, QuestSelectSchema } from "@/drizzle/schema"
import { FetchFamilyQuestsResult } from "./query"

/** 家族クエストフィルター */
export const FamilyQuestFilterScheme = z.object({
  name: z.string().optional(),
  tags: z.array(z.string()).default([]),
})
export type FamilyQuestFilterType = z.infer<typeof FamilyQuestFilterScheme>

/** 家族クエスト検索パラメータ */
export const FamilyQuestSearchParamsScheme = FamilyQuestFilterScheme.extend({
  sortColumn: z.string().refine((v) => v in QuestSelectSchema.shape),
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
  questId: FamilyQuestSelectSchema.shape.questId
})
export type PostFamilyQuestResponse = z.infer<typeof PostFamilyQuestResponseScheme>
