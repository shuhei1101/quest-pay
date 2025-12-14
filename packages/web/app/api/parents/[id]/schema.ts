import { z } from "zod"
import { FetchParentResult } from "../query"

/** 親取得レスポンススキーマ */
export const GetParentResponseSchema = z.object({
  parent: FetchParentResult,
})
export type GetParentResponse = z.infer<typeof GetParentResponseSchema>
