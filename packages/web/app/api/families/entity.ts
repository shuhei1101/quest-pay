import { z } from "zod"

import { IdScheme as Id } from "@/app/(core)/_scheme/checkScheme"

/** DBの家族スキーマ */
export const FamilyEntityScheme = z.object({
  id: z.string(),
  display_id: z.string(),
  local_name: z.string(),
  online_name: z.string().nullable(),
  icon_id: z.number(),
  icon_color: z.string(),
  introduction: z.string().nullable(),
  invite_code: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})
export type FamilyEntity = z.infer<typeof FamilyEntityScheme>

// 値オブジェクト
export const DisplayId = Id.min(5, { error: "IDは5文字以上で入力してください。"}).max(20, { error: "IDは20文字以下で入力してください。"})
/** 家族名（ローカル） */
export const LocalName = z.string().nonempty({error: "家族名は必須です。"}).max(10, { error: "家族名は10文字以下で入力してください。"})
/** 家族名（オンライン） */
export const OnlineName = z.string().nullable()
