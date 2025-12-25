import { z } from "zod"

/** 子として参加リクエストスキーマ */
export const JoinChildRequestScheme = z.object({
  invite_code: z.string(),
})
export type JoinChildRequest = z.infer<typeof JoinChildRequestScheme>
