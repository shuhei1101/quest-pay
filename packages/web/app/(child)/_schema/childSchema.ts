import { z } from "zod";

/** DBの子供スキーマ */
export const ChildEntitySchema = z.object({
  user_id: z.string(),
  family_id: z.number(),
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
export type ChildColumns = keyof ChildEntity;

/** 子供フォームスキーマ */
export const ChildFormSchema = z.object({
  /** 最低貯蓄額 */
  min_savings: z.number().optional(),
  /** 現在の貯金額 */
  current_savings: z.number().optional(),
  /** 現在のレベル */
  current_level: z.number().optional(),
  /** 累計獲得経験値 */
  total_exp: z.number().optional()
})

/** 子供フォームスキーマの型 */
export type ChildFormSchema = z.infer<typeof ChildFormSchema>;

/** エンティティから子供フォームスキーマを生成する */
export const createChildSchemaFromEntity = (entity: ChildEntity): ChildFormSchema => {
  return {
    min_savings: entity.min_savings,
    current_savings: entity.current_savings,
    current_level: entity.current_level,
    total_exp: entity.total_exp
  }
}
