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
