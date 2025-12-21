import { z } from "zod"
import { FamilyQuestEntityScheme } from "../family/entity"
import { ChildEntityScheme } from "../../children/entity"

/** DBのクエストの子供情報スキーマ
 * 家族クエストに参加している子供の情報を管理するエンティティ
 */
export const QuestChildrenEntityScheme = z.object({
  id: z.string(),
  family_quest_id: FamilyQuestEntityScheme.shape.id, // 家族クエストID
  child_id: ChildEntityScheme.shape.id, // 子供ID
  current_level: z.number(), // 現在のレベル
  created_at: z.string(), // 作成日時
})
export type QuestChildrenEntity = z.infer<typeof QuestChildrenEntityScheme>

// クエストのカラム名
const QuestChildrenColumnsArray = [
] as const
export const QuestChildrenColumnsScheme = z.enum(QuestChildrenColumnsArray)
export type QuestChildrenColumns = z.infer<typeof QuestChildrenColumnsScheme>
