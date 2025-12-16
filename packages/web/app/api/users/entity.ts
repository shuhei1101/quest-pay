import { z } from "zod"

/** DBのユーザスキーマ */
export const ProfileEntityScheme = z.object({
  id: z.string(),
  user_id: z.string().nullable(),
  type: z.enum(["parent", "child"]),
  name: z.string(),
  icon_id: z.number(),
  icon_color: z.string(),
  birthday: z.string(),
  family_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type ProfileEntity = z.infer<typeof ProfileEntityScheme>

// ユーザカラム名の型
export type ProfileColumns = keyof ProfileEntity

// 値オブジェクト
export const UserName = z.string().nonempty({error: "氏名は必須です。"})
export const Birthday = z.string().nonempty({error: "誕生日は必須です。"}).refine((val) => !isNaN(Date.parse(val)), {
  message: "有効な日付文字列ではありません",
})
