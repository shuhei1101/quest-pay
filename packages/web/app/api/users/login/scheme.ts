import { UserInfoViewScheme } from "@/app/api/users/view"
import { z } from "zod"

/** ログインユーザ取得レスポンススキーマ */
export const GetLoginUserResponseScheme = z.object({
  userInfo: UserInfoViewScheme,
})
export type GetLoginUserResponse = z.infer<typeof GetLoginUserResponseScheme>
