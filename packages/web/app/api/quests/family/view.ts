import { z } from "zod"

/** DBの親スキーマ */
export const FamilyQuestViewSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  family_id: z.number(),
  is_public: z.boolean(),
})
export type FamilyQuestView = z.infer<typeof FamilyQuestViewSchema>

// クエストのカラム名
const FamilyQuestColumnsArray = ["id", "name", "icon", "family_id", "is_public"] as const
export const FamilyQuestColumnsSchema = z.enum(FamilyQuestColumnsArray)
export type FamilyQuestColumns = z.infer<typeof FamilyQuestColumnsSchema>
