import { z } from "zod"

/** DBのクエストスキーマ */
export const QuestEntityScheme = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["template", "public", "family"]),
  created_at: z.string(),
  updated_at: z.string(),
  category_id: z.number().nullable(),
  icon_id: z.number(),
  icon_color: z.string(),
  age_from: z.number().nullable(), // 年齢制限開始
  age_to: z.number().nullable(), // 年齢制限終了
  month_from: z.number().nullable(), // 月指定開始月
  month_to: z.number().nullable(), // 月指定終了月
  client: z.string(), // 依頼者氏名（任意の名前を設定可能）
  request_detail: z.string(),  // 依頼詳細
})
export type QuestEntity = z.infer<typeof QuestEntityScheme>

// クエストのカラム名
const QuestColumnsArray = [
  "id", 
  "name", 
  "type", 
  "icon_id", 
  "created_at", 
  "updated_at", 
  "category_id",
  "age_from",
  "age_to",
  "has_published_month",
  "month_from",
  "month_to",
  "client",
] as const
export const QuestColumnsScheme = z.enum(QuestColumnsArray)
export type QuestColumns = z.infer<typeof QuestColumnsScheme>

/** DBのクエストスキーマ */
export const QuestDetailsEntityScheme = z.object({
  id: z.string(),
  quest_id: z.string(),
  level: z.number(),
  success_condition: z.string(), // 成功条件
  required_completion_count: z.number(), // 目標達成までの回数
  reward: z.number(), // 報酬額
  child_exp: z.number(), // 獲得経験値
  required_clear_count: z.number(), // 次レベルまでに必要なクエストクリア回数
})
export type QuestDetailsEntity = z.infer<typeof QuestDetailsEntityScheme>

// クエストのカラム名
const QuestDetailsArray = [
  "id",
  "quest_id",
  "level",
  "success_condition",
  "required_completion_count",
  "reward",
  "child_exp",
  "required_clear_count",
] as const
export const QuestDetailsColumnsScheme = z.enum(QuestDetailsArray)
export type QuestDetailsColumns = z.infer<typeof QuestDetailsColumnsScheme>
