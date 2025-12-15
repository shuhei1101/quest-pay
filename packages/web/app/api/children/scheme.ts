import { z } from "zod"
import { FetchChildrenResult } from "./query"
import { ChildFormScheme as ChildFormScheme } from "@/app/(app)/children/[id]/form"

/** 子ども取得レスポンススキーマ */
export const GetChildrenResponseScheme = z.object({
  children: FetchChildrenResult,
})
export type GetChildrenResponse = z.infer<typeof GetChildrenResponseScheme>


/** 子供挿入リクエストスキーマ */
export const PostChildRequestScheme = z.object({
  form: ChildFormScheme
})
export type PostChildRequest = z.infer<typeof PostChildRequestScheme>
export const PostChildResponseScheme = z.object({
  childId: z.string()
})
export type PostChildResponse = z.infer<typeof PostChildResponseScheme>
