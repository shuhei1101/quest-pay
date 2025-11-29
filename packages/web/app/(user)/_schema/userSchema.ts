import { z } from "zod";

/** DBのユーザスキーマ */
export const RawUser = z.object({
  user_id: z.string(),
  type: z.enum(["parent", "child"]),
  name: z.string(),
  icon: z.string(),
  birthday: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type RawUser = z.infer<typeof RawUser>

// 更新用
export const UserInsert = RawUser.omit({id: true, created_at: true, updated_at: true})
export const UserUpdate = RawUser.omit({created_at: true})
export const UserDelete = RawUser.pick({id: true, created_at: true})
export type UserInsert = z.infer<typeof UserInsert>
export type UserUpdate = z.infer<typeof UserUpdate>
export type UserDelete = z.infer<typeof UserDelete>

// ユーザカラム名の型
export type UserColumns = keyof RawUser;

/** ユーザフォームスキーマ */
export const userFormSchema = z.object({
  /** ユーザタイプ */
  type: z.enum(["parent", "child"]),
  /** ユーザ名 */
  name: z.string().nonempty({error: "氏名は必須です。"}),
  /** アイコン */
  icon: z.string().default(""),
})

/** ユーザフォームスキーマの型 */
export type UserFormSchema = z.infer<typeof userFormSchema>;

/** エンティティからユーザフォームスキーマを生成する */
export const createUserSchemaFromEntity = (entity: RawUser): UserFormSchema => {
  return {
    type: entity.type,
    name: entity.name,
    icon: entity.icon,
  }
}
