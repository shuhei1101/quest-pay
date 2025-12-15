import { z } from "zod"

/** DBの親スキーマ */
export const ParentEntityScheme = z.object({
  id: z.string(),
  invite_code: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type ParentEntity = z.infer<typeof ParentEntityScheme>
