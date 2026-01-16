import { z } from "zod"

/** パスワードリセット依頼フォームスキーマ */
export const ForgotPasswordFormScheme = z.object({
  /** メールアドレス */
  email: z.string().min(1, {message: "メールアドレスは必須です。"}).email({message: "正しいメールアドレスを入力してください。"}),
})

/** パスワードリセット依頼フォームの型 */
export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormScheme>
