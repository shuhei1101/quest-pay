import { z } from "zod"
import { ChildFormSchema as ChildFormSchema } from "@/app/(app)/children/[id]/form"
import { FetchChildrenResultSchema } from "./query"
import { ChildSelectSchema } from "@/drizzle/schema"

/** 子ども取得レスポンススキーマ */
export const GetChildrenResponseScheme = z.object({
  children: FetchChildrenResultSchema,
})
export type GetChildrenResponse = z.infer<typeof GetChildrenResponseScheme>


/** 子供挿入リクエストスキーマ */
export const PostChildRequestScheme = z.object({
  form: ChildFormSchema
})
export type PostChildRequest = z.infer<typeof PostChildRequestScheme>
/** 子供登録レスポンススキーマ */
export const PostChildResponseScheme = z.object({
  childId: ChildSelectSchema.shape.id,
})
export type PostChildResponse = z.infer<typeof PostChildResponseScheme>
