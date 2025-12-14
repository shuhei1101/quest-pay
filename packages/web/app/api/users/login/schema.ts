import { UserInfoViewSchema } from "@/app/api/users/view"
import { z } from "zod"

/** ログインユーザ取得レスポンススキーマ */
export const GetLoginUserResponseSchema = z.object({
  userInfo: UserInfoViewSchema,
})
export type GetLoginUserResponse = z.infer<typeof GetLoginUserResponseSchema>
