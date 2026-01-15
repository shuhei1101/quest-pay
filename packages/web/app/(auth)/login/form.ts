import { z } from "zod";

/** 認証フォーム（ログイン・サインアップ共通）のベーススキーマ */
export const AuthFormScheme = z.object({
  /** メールアドレス */
  email: z.string().nonempty({error: "メールアドレスは必須です。"}),
  /** パスワード */
  password: z.string().nonempty({error: "パスワードは必須です。"}).min(6, { error: "パスワードは6文字以上で入力してください。"}).max(20, { error: "ユーザ名は20文字以下で入力してください。"}),
})

/** ログインフォームスキーマ */
export const LoginFormScheme = AuthFormScheme.extend({
  /** ログイン状態を保持するか */
  rememberMe: z.boolean(),
})

/** 認証フォーム（ログイン・サインアップ共通）の型 */
export type AuthFormType = z.infer<typeof AuthFormScheme>;

/** ログインフォームスキーマの型 */
export type LoginFormType = z.infer<typeof LoginFormScheme>;
