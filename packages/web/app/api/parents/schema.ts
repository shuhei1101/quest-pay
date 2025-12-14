import { z } from "zod"
import { FetchParentsResult } from "./query"

/** 親取得レスポンススキーマ */
export const GetParentsResponseSchema = z.object({
  parents: FetchParentsResult,
})
export type GetParentsResponse = z.infer<typeof GetParentsResponseSchema>
