import { FamilyInviteScheme } from "@/app/(app)/families/invite/form"
import { z } from "zod"

/** メール送信リクエストスキーマ */
export const PostFamilyInviteRequestScheme = z.object({
  form: FamilyInviteScheme
})
export type PostFamilyInviteRequest = z.infer<typeof PostFamilyInviteRequestScheme>
