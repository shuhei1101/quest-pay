import { z } from "zod"
import { FetchParentResultSchema } from "../query"

/** 親取得レスポンススキーマ */
export const GetParentResponseScheme = z.object({
  parent: FetchParentResultSchema,
})
export type GetParentResponse = z.infer<typeof GetParentResponseScheme>
