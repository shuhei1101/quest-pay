import { UserInfoViewSchema } from "@/app/api/users/view"
import { z } from "zod"

/** 子として参加リクエストスキーマ */
export const JoinChildRequestSchema = z.object({
  invite_code: z.string(),
})
export type JoinChildRequest = z.infer<typeof JoinChildRequestSchema>
