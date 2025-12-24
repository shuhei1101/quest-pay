import { z } from "zod"

/** IDスキーマ */
export const IdSchema = z.string().regex(/^[a-zA-Z0-9_]+$/, {
  message: "半角英数字とアンダースコアのみ使用可能です",
})

/** 家族表示IDスキーマ */
export const DisplayIdSchema = IdSchema.min(5, { error: "IDは5文字以上で入力してください。"}).max(20, { error: "IDは20文字以下で入力してください。"})
/** 家族名（ローカル）スキーマ */
export const LocalNameSchema = z.string().nonempty({error: "家族名は必須です。"}).max(10, { error: "家族名は10文字以下で入力してください。"})
/** 家族名（オンライン）スキーマ */
export const OnlineNameSchema = z.string().nullable()
/** アイコンIDスキーマ */
export const IconIdSchema = z.number({error: "アイコンは必須です。"})
/** アイコンカラー スキーマ */
export const IconColorSchema = z.string({error: "アイコンカラーは必須です。"})
/** ユーザ名スキーマ */
export const UserNameSchema = z.string().nonempty({error: "氏名は必須です。"})
/** 誕生日スキーマ */
export const BirthdaySchema = z.string().nonempty({error: "誕生日は必須です。"}).refine((val) => !isNaN(Date.parse(val)), {
  message: "有効な日付文字列ではありません",
})


/** ソート順スキーマ */
const SortOrderArray = ['asc', 'desc'] as const
export const SortOrderScheme = z.enum(SortOrderArray)
export type SortOrder = z.infer<typeof SortOrderScheme>
