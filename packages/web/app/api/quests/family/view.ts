import { z } from "zod"
import { QuestEntitySchema } from "../entity"
import { FamilyQuestEntitySchema } from "./entity"

/** 家族クエストビュー */
export const FamilyQuestViewSchema = QuestEntitySchema.pick({
    id: true,
    name: true,
    icon: true,
    created_at: true,
    updated_at: true,
  }).extend(FamilyQuestEntitySchema.pick({
    family_id: true,
    is_public: true,
  }).shape
)
export type FamilyQuestView = z.infer<typeof FamilyQuestViewSchema>

// 家族クエストビューのカラム名
const FamilyQuestColumnsArray = ["id", "name", "icon", "family_id", "is_public"] as const
export const FamilyQuestColumnsSchema = z.enum(FamilyQuestColumnsArray)
export type FamilyQuestColumns = z.infer<typeof FamilyQuestColumnsSchema>
