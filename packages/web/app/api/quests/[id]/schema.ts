import { QuestDeleteSchema, QuestEntitySchema, QuestUpdateSchema } from "@/app/api/quests/entity"
import { QuestTagEntitySchema, QuestTagUpdateSchema } from "@/app/(app)/quests/_schema/questTagEntity"
import { z } from "zod"

/** クエスト取得レスポンススキーマ */
export const QuestGetResponseSchema = z.object({
  quest: QuestEntitySchema.extend({
    quest_tags: z.array(QuestTagEntitySchema)
  })
})
export type QuestGetResponse = z.infer<typeof QuestGetResponseSchema>

/** クエスト更新リクエストスキーマ */
export const QuestPutRequestSchema = z.object({
  quest: QuestUpdateSchema,
  tags: z.array(QuestTagUpdateSchema)
})
export type QuestPutRequest = z.infer<typeof QuestPutRequestSchema>

/** クエスト削除リクエストスキーマ */
export const QuestDeleteRequestSchema = z.object({
  quest: QuestDeleteSchema,
})
export type QuestDeleteRequest = z.infer<typeof QuestDeleteRequestSchema>
