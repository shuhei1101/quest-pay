import { z } from "zod";

/** ログインフォームスキーマ */
export const LoginFormSchema = z.object({
  /** メールアドレス */
  email: z.string().nonempty({error: "メールアドレスは必須です。"}),
  /** パスワード */
  password: z.string().nonempty({error: "パスワードは必須です。"}).min(6, { error: "パスワードは6文字以上で入力してください。"}).max(20, { error: "ユーザ名は20文字以下で入力してください。"}),
})

/** ログインフォームスキーマの型 */
export type LoginFormType = z.infer<typeof LoginFormSchema>;
