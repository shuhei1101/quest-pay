import { z } from "zod";

/** DBの親スキーマ */
export const RawParent = z.object({
  user_id: z.string(),
  family_id: z.number(),
  created_at: z.string(),
  updated_at: z.string()
})
export type RawParent = z.infer<typeof RawParent>

// 更新用
export const ParentInsert = RawParent.omit({id: true, created_at: true, updated_at: true})
export const ParentUpdate = RawParent.omit({created_at: true})
export const ParentDelete = RawParent.pick({id: true, updated_at: true})
export type ParentInsert = z.infer<typeof ParentInsert>
export type ParentUpdate = z.infer<typeof ParentUpdate>
export type ParentDelete = z.infer<typeof ParentDelete>

// 親のカラム名
export type ParentColumns = keyof RawParent;

/** 親フォームスキーマ */
export const ParentFormSchema = z.object({
})

/** 親フォームスキーマの型 */
export type ParentFormSchema = z.infer<typeof ParentFormSchema>;

/** エンティティから親フォームスキーマを生成する */
export const createParentSchemaFromEntity = (entity: RawParent): ParentFormSchema => {
  return {
  }
}
