import { z } from "zod"

/** パスワード変更フォームスキーマ */
export const ResetPasswordFormScheme = z.object({
  /** 新しいパスワード */
  password: z.string().nonempty({error: "パスワードは必須です。"}).min(6, { error: "パスワードは6文字以上で入力してください。"}).max(20, { error: "パスワードは20文字以下で入力してください。"}),
  /** パスワード確認 */
  passwordConfirm: z.string().nonempty({error: "パスワード（確認）は必須です。"}),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "パスワードが一致しません。",
  path: ["passwordConfirm"],
})

/** パスワード変更フォームの型 */
export type ResetPasswordFormType = z.infer<typeof ResetPasswordFormScheme>
