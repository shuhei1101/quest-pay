import { z } from "zod"
import { ChildEntitySchema } from "./entity"
import { ProfileInsertSchema } from "../users/entity"

/** 子供挿入リクエストスキーマ */
export const PostChildRequestSchema = z.object({
  child: ProfileInsertSchema.omit({
    id: true,
    user_id: true,
    family_id: true
  })
})
export type PostChildRequest = z.infer<typeof PostChildRequestSchema>
export const PostChildResponseSchema = z.object({
  childId: z.string()
})
export type PostChildResponse = z.infer<typeof PostChildResponseSchema>
