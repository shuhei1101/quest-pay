import { z } from "zod";

/** DBの家族スキーマ */
export const RawFamily = z.object({
  id: z.number(),
  display_id: z.string(),
  local_name: z.string(),
  online_name: z.string().optional(),
  icon: z.string(),
  introduction: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})
export type RawFamily = z.infer<typeof RawFamily>

// 更新用
export const FamilyInsert = RawFamily.omit({id: true, created_at: true, updated_at: true})
export const FamilyUpdate = RawFamily.omit({created_at: true})
export const FamilyDelete = RawFamily.pick({id: true, updated_at: true})
export type FamilyInsert = z.infer<typeof FamilyInsert>
export type FamilyUpdate = z.infer<typeof FamilyUpdate>
export type FamilyDelete = z.infer<typeof FamilyDelete>

// 家族のカラム名
export type FamilyColumns = keyof RawFamily;

/** 家族フォームスキーマ */
export const FamilyFormSchema = z.object({
  /** 表示ID */
  display_id: z.string().min(5, { error: "IDは5文字以上で入力してください。"}).max(20, { error: "IDは20文字以下で入力してください。"}),
  /** 家族名（ローカル） */
  local_name: z.string().nonempty({error: "家族名は必須です。"}).max(10, { error: "家族名は10文字以下で入力してください。"}),
  /** 家族名（オンライン） */
  online_name: z.string().optional(),
  /** アイコン */
  icon: z.string(),
  /** 紹介文 */
  introduction: z.string()
})

/** 家族フォームスキーマの型 */
export type FamilyFormSchema = z.infer<typeof FamilyFormSchema>;

/** エンティティから家族フォームスキーマを生成する */
export const createFamilySchemaFromEntity = (entity: RawFamily): FamilyFormSchema => {
  return {
    display_id: entity.display_id,
    local_name: entity.local_name,
    online_name: entity.online_name,
    icon: entity.icon,
    introduction: entity.introduction,
  }
}
