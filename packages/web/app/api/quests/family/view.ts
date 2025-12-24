import { z } from "zod"
import { QuestEntityScheme } from "../entity"
import { FamilyQuestEntityScheme } from "./entity"
import { IconEntityScheme } from "@/app/api/icons/entity"
import { SortOrder } from "@/app/(core)/schema"

/** 家族クエストビュー */
export const FamilyQuestViewScheme = QuestEntityScheme.pick({
    id: true,
    name: true,
    icon_id: true,
    created_at: true,
    updated_at: true,
    category_id: true,
    icon_color: true,
    age_from: true,
    age_to: true,
    month_from: true,
    month_to: true,
    client: true,
    request_detail: true,
  }).extend(FamilyQuestEntityScheme.pick({
    family_id: true,
    is_public: true,
    is_client_public: true,
    is_request_detail_public: true,
  }).shape
).extend({
  family_quest_id: FamilyQuestEntityScheme.shape.id,
  icon_name: IconEntityScheme.shape.name,
  icon_size: IconEntityScheme.shape.size,
})
export type FamilyQuestView = z.infer<typeof FamilyQuestViewScheme>

// 家族クエストビューのカラム名
const FamilyQuestColumnsArray = ["id", "name", "family_id", "is_public"] as const
export const FamilyQuestColumnsScheme = z.enum(FamilyQuestColumnsArray)
export type FamilyQuestColumns = z.infer<typeof FamilyQuestColumnsScheme>

export type FamilyQuestSort = {column: FamilyQuestColumns, order: SortOrder}
