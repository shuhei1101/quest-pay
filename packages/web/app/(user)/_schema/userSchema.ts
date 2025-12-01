
import { z } from "zod";

/** DBのユーザスキーマ */
export const UserEntitySchema = z.object({
  user_id: z.string(),
  name: z.string(),
  icon: z.string(),
  birthday: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type UserEntity = z.infer<typeof UserEntitySchema>

// 更新用
export const UserInsertSchema = UserEntitySchema.omit({created_at: true, updated_at: true})
export const UserUpdateSchema = UserEntitySchema.omit({created_at: true})
export const UserDeleteSchema = UserEntitySchema.pick({user_id: true, updated_at: true})
export type UserInsert = z.infer<typeof UserInsertSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>
export type UserDelete = z.infer<typeof UserDeleteSchema>

// ユーザカラム名の型
export type UserColumns = keyof UserEntity

// 値オブジェクト
export const UserName = z.string().nonempty({error: "氏名は必須です。"})
export const Birthday = z.string().nonempty({error: "誕生日は必須です。"}).refine((val) => !isNaN(Date.parse(val)), {
  message: "有効な日付文字列ではありません",
})
