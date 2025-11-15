import { z } from "zod";

/** DBのユーザスキーマ */
export const rawUser = z.object({
  user_id: z.string(),
  name: z.string(),
  type_id: z.number(),
  created_at: z.string(),
  updated_at: z.string()
})
export type RawUser = z.infer<typeof rawUser>

// 更新用
export type UserInsert = Pick<RawUser, "name" | "user_id">
export type UserUpdate = Omit<RawUser, "created_at">
export type UserDelete = Pick<RawUser, "user_id" | "updated_at">

// ユーザのカラム名
export type UserColumns = keyof RawUser;

/** ユーザフォームスキーマ */
export const userFormSchema = z.object({
  /** ユーザ名 */
  name: z.string().nonempty({error: "氏名は必須です。"}),
  /** ユーザタイプ */
  type_id: z.number().optional(),
  /** UUID */
  user_id: z.string().optional(),
  /** 作成日時 */
  created_at: z.string().optional(),
  /** 更新日時 */
  updated_at: z.string().optional()
})

/** ユーザフィルター */
export type UserFilterSchema = Partial<Pick<RawUser, 
  "name" | "type_id"
>>

/** ユーザフォームスキーマの型 */
export type UserFormSchema = z.infer<typeof userFormSchema>;

/** エンティティからユーザフォームスキーマを生成する */
export const createUserSchemaFromEntity = (entity: RawUser): UserFormSchema => {
  return {
    name: entity.name,
    user_id: entity.user_id,
    type_id: entity.type_id,
    created_at: entity.created_at,
    updated_at: entity.updated_at
  }
}

/** クエリオブジェクトからユーザフィルターに変換する */
export const createUserFilterFromQueryObj = (queryObj: any) => {
  // クエリオブジェクトが空の場合はリターンする
  if (!queryObj) return {}

  const result: UserFilterSchema = {}

  // 氏名をセットする
  result.name = queryObj.name ?? undefined
  
  return result
}
