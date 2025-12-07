import { z } from "zod"

/** DBの子供スキーマ */
export const ChildEntitySchema = z.object({
  id: z.string(),
  min_savings: z.number().optional(),
  current_savings: z.number().optional(),
  current_level: z.number().optional(),
  total_exp: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type ChildEntity = z.infer<typeof ChildEntitySchema>

// 更新用
export const ChildInsert = ChildEntitySchema.omit({id: true, created_at: true, updated_at: true})
export const ChildUpdate = ChildEntitySchema.omit({created_at: true})
export const ChildDelete = ChildEntitySchema.pick({id: true, updated_at: true})
export type ChildInsert = z.infer<typeof ChildInsert>
export type ChildUpdate = z.infer<typeof ChildUpdate>
export type ChildDelete = z.infer<typeof ChildDelete>

// 子供のカラム名
export type ChildColumns = keyof ChildEntity
