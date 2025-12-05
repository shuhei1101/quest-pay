import { z } from "zod"

/** DBのユーザスキーマ */
export const ProfileEntitySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  name: z.string(),
  icon: z.string(),
  birthday: z.string(),
  family_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type ProfileEntity = z.infer<typeof ProfileEntitySchema>

// 更新用
export const ProfileInsertSchema = ProfileEntitySchema.omit({created_at: true, updated_at: true})
export const ProfileUpdateSchema = ProfileEntitySchema.omit({created_at: true})
export const ProfileDeleteSchema = ProfileEntitySchema.pick({user_id: true, updated_at: true})
export type ProfileInsert = z.infer<typeof ProfileInsertSchema>
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>
export type ProfileDelete = z.infer<typeof ProfileDeleteSchema>

// ユーザカラム名の型
export type ProfileColumns = keyof ProfileEntity

// 値オブジェクト
export const UserName = z.string().nonempty({error: "氏名は必須です。"})
export const Birthday = z.string().nonempty({error: "誕生日は必須です。"}).refine((val) => !isNaN(Date.parse(val)), {
  message: "有効な日付文字列ではありません",
})
