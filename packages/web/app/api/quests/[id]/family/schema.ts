import { QuestDeleteSchema, QuestEntitySchema, QuestUpdateSchema } from "@/app/api/quests/entity"
import { QuestTagEntitySchema, QuestTagUpdateSchema } from "@/app/quests/_schema/questTagEntity"
import { z } from "zod"
import { FamilyQuestUpdateSchema } from "../../family/entity"

/** 家族クエスト取得レスポンススキーマ */
export const FamilyQuestGetResponseSchema = z.object({
  quest: QuestEntitySchema.extend({
    quest_tags: z.array(QuestTagEntitySchema)
  })
})
export type FamilyQuestGetResponse = z.infer<typeof FamilyQuestGetResponseSchema>

/** 家族クエスト更新リクエストスキーマ */
export const FamilyQuestPutRequestSchema = z.object({
  quest: QuestUpdateSchema.omit({type: true}),
  tags: z.array(QuestTagUpdateSchema),
  familyQuest: FamilyQuestUpdateSchema.omit({family_id: true})
})
export type FamilyQuestPutRequest = z.infer<typeof FamilyQuestPutRequestSchema>

/** 家族クエスト削除リクエストスキーマ */
export const FamilyQuestDeleteRequestSchema = z.object({
  quest: QuestDeleteSchema,
})
export type FamilyQuestDeleteRequest = z.infer<typeof FamilyQuestDeleteRequestSchema>
