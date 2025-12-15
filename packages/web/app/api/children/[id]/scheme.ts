import { z } from "zod"
import { FetchChildResult } from "../query"

/** 子ども取得レスポンススキーマ */
export const GetChildResponseScheme = z.object({
  child: FetchChildResult,
})
export type GetChildResponse = z.infer<typeof GetChildResponseScheme>
