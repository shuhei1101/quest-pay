import { z } from "zod"
import { UserInfoViewSchema } from "../../view"

/** 子供取得レスポンススキーマ */
export const GetChildResponseSchema = z.object({
  user: UserInfoViewSchema.optional()
})
export type GetChildResponse = z.infer<typeof GetChildResponseSchema>

// /** 子供更新リクエストスキーマ */
// export const PutChildRequestSchema = z.object({
//   quest: QuestUpdateSchema.omit({type: true}),
//   tags: z.array(QuestTagUpdateSchema),
//   family_quest: ChildUpdateSchema.omit({family_id: true})
// })
// export type PutChildRequest = z.infer<typeof PutChildRequestSchema>

// /** 子供削除リクエストスキーマ */
// export const DeleteChildRequestSchema = z.object({
//   quest: QuestDeleteSchema,
// })
// export type DeleteChildRequest = z.infer<typeof DeleteChildRequestSchema>
