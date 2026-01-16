import { z } from "zod"

/** パスワードリセット依頼フォームスキーマ */
export const ForgotPasswordFormScheme = z.object({
  /** メールアドレス */
  email: z.string().nonempty({error: "メールアドレスは必須です。"}),
})

/** パスワードリセット依頼フォームの型 */
export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormScheme>
