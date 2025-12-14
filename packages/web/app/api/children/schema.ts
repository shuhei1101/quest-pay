import { z } from "zod"
import { ChildEntitySchema } from "./entity"
import { ProfileInsertSchema } from "../users/entity"
import { FetchChildrenResult } from "./query"

/** 子ども取得レスポンススキーマ */
export const GetChildrenResponseSchema = z.object({
  children: FetchChildrenResult,
})
export type GetChildrenResponse = z.infer<typeof GetChildrenResponseSchema>


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
