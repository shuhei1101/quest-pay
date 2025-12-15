import { z } from "zod"

/** DBのクエストスキーマ */
export const FamilyQuestEntityScheme = z.object({
  id: z.string(),
  family_id: z.string(),
  is_public: z.boolean(),
  quest_id: z.string(),
})
export type FamilyQuestEntity = z.infer<typeof FamilyQuestEntityScheme>
