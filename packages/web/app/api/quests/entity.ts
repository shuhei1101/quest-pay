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
  age_from: z.number().nullable(),
  age_to: z.number().nullable(),
  has_published_month: z.boolean(),
  month_from: z.number().nullable(),
  month_to: z.number().nullable(),
  client: z.string(),
  request_detail: z.string(),
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
  target_count: z.number(), // 目標達成までの回数
  reward: z.number(), // 報酬額
  child_exp: z.number(), // 獲得経験値
  quest_exp: z.number(), // クエスト経験値
  required_exp: z.number(), // 必要経験値
})
export type QuestDetailsEntity = z.infer<typeof QuestDetailsEntityScheme>

// クエストのカラム名
const QuestDetailsArray = [
  "id",
  "quest_id",
  "level",
  "success_condition",
  "target_count",
  "reward",
  "child_exp",
  "quest_exp",
  "required_exp",
] as const
export const QuestDetailsColumnsScheme = z.enum(QuestDetailsArray)
export type QuestDetailsColumns = z.infer<typeof QuestDetailsColumnsScheme>
