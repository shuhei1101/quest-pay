import { z } from "zod"

/** DBの子供スキーマ */
export const ChildEntityScheme = z.object({
  id: z.string(),
  profile_id: z.string(),
  invite_code: z.string(),
  min_savings: z.number().optional(),
  current_savings: z.number().optional(),
  current_level: z.number().optional(),
  total_exp: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type ChildEntity = z.infer<typeof ChildEntityScheme>

// 子供のカラム名
export type ChildColumns = keyof ChildEntity
