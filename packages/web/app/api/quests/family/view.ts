import { z } from "zod"
import { QuestEntitySchema } from "../entity"
import { FamilyQuestEntitySchema } from "./entity"
import { IconEntitySchema } from "@/app/api/icons/entity"
import { SortOrder } from "@/app/(core)/schema"

/** 家族クエストビュー */
export const FamilyQuestViewSchema = QuestEntitySchema.pick({
    id: true,
    name: true,
    icon_id: true,
    created_at: true,
    updated_at: true,
    category_id: true,
    icon_color: true
  }).extend(FamilyQuestEntitySchema.pick({
    family_id: true,
    is_public: true,
  }).shape
).extend({
  icon_name: IconEntitySchema.shape.name,
  icon_size: IconEntitySchema.shape.size,
})
export type FamilyQuestView = z.infer<typeof FamilyQuestViewSchema>

// 家族クエストビューのカラム名
const FamilyQuestColumnsArray = ["id", "name", "family_id", "is_public"] as const
export const FamilyQuestColumnsSchema = z.enum(FamilyQuestColumnsArray)
export type FamilyQuestColumns = z.infer<typeof FamilyQuestColumnsSchema>

export type FamilyQuestSort = {column: FamilyQuestColumns, order: SortOrder}
