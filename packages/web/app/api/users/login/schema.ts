import { UserInfoViewSchema } from "@/app/api/users/view"
import { z } from "zod"

/** クエスト取得レスポンススキーマ */
export const UsersLoginGetResponseSchema = z.object({
  userInfo: UserInfoViewSchema,
})
export type UsersLoginGetResponse = z.infer<typeof UsersLoginGetResponseSchema>
