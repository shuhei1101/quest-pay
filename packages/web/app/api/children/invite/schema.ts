import { z } from "zod"

/** メール送信リクエストスキーマ */
export const PostFamilyInviteRequestSchema = z.object({
  email: z.string(),
})
export type PostFamilyInviteRequest = z.infer<typeof PostFamilyInviteRequestSchema>
