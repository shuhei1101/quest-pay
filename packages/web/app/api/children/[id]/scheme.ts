import { z } from "zod"
import { FetchChildResultSchema } from "../query"

/** 子ども取得レスポンススキーマ */
export const GetChildResponseScheme = z.object({
  child: FetchChildResultSchema,
})
export type GetChildResponse = z.infer<typeof GetChildResponseScheme>
