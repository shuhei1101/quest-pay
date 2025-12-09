import { z } from "zod"
import { FamilyEntitySchema, FamilyInsertSchema } from "./entity"
import { ProfileInsertSchema } from "../users/entity"

/** クエスト挿入リクエストスキーマ */
export const PostFamilyRequestSchema = z.object({
  family: FamilyInsertSchema.omit({
    introduction: true,
  }),
  parent: ProfileInsertSchema.omit({
    family_id: true,
    id: true,
    user_id: true,
  })
})
export type PostFamilyRequest = z.infer<typeof PostFamilyRequestSchema>

/** クエスト挿入レスポンススキーマ */
export const PostFamilyResponseSchema = z.object({
  familyId: FamilyEntitySchema.shape.id
})
export type PostFamilyResponse = z.infer<typeof PostFamilyResponseSchema>
