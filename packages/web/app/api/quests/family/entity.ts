import { z } from "zod"

/** DBのクエストスキーマ */
export const FamilyQuestEntitySchema = z.object({
  id: z.string(),
  family_id: z.string(),
  is_public: z.boolean(),
  quest_id: z.string(),
})
export type FamilyQuestEntity = z.infer<typeof FamilyQuestEntitySchema>

// 更新用
export const FamilyQuestInsertSchema = FamilyQuestEntitySchema.omit({id: true, quest_id: true})
export const FamilyQuestUpdateSchema = FamilyQuestEntitySchema.omit({id: true, quest_id: true})
export const FamilyQuestDeleteSchema = FamilyQuestEntitySchema.pick({id: true})
export type FamilyQuestInsert = z.infer<typeof FamilyQuestInsertSchema>
export type FamilyQuestUpdate = z.infer<typeof FamilyQuestUpdateSchema>
export type FamilyQuestDelete = z.infer<typeof FamilyQuestDeleteSchema>
