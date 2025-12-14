import { z } from "zod"
import { FetchChildResult } from "../query"

/** 子ども取得レスポンススキーマ */
export const GetChildResponseSchema = z.object({
  child: FetchChildResult,
})
export type GetChildResponse = z.infer<typeof GetChildResponseSchema>
