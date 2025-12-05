import { z } from "zod"

import { IdSchema as Id } from "@/app/(core)/_schema/checkSchema"

/** DBの家族スキーマ */
export const FamilyEntitySchema = z.object({
  id: z.number(),
  display_id: z.string(),
  local_name: z.string(),
  online_name: z.string().optional(),
  icon: z.string().optional(),
  introduction: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string()
})
export type FamilyEntity = z.infer<typeof FamilyEntitySchema>

// 更新用
export const FamilyInsertSchema = FamilyEntitySchema.omit({id: true, created_at: true, updated_at: true})
export const FamilyUpdateSchema = FamilyEntitySchema.omit({created_at: true})
export const FamilyDeleteSchema = FamilyEntitySchema.pick({id: true, updated_at: true})
export type FamilyInsert = z.infer<typeof FamilyInsertSchema>
export type FamilyUpdate = z.infer<typeof FamilyUpdateSchema>
export type FamilyDelete = z.infer<typeof FamilyDeleteSchema>

// 値オブジェクト
export const DisplayId = Id.min(5, { error: "IDは5文字以上で入力してください。"}).max(20, { error: "IDは20文字以下で入力してください。"})
/** 家族名（ローカル） */
export const LocalName = z.string().nonempty({error: "家族名は必須です。"}).max(10, { error: "家族名は10文字以下で入力してください。"})
/** 家族名（オンライン） */
export const OnlineName = z.string().optional()
