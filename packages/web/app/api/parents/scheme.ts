import { z } from "zod"
import { FetchParentsResultSchema } from "./query"

/** 親取得レスポンススキーマ */
export const GetParentsResponseScheme = z.object({
  parents: FetchParentsResultSchema,
})
export type GetParentsResponse = z.infer<typeof GetParentsResponseScheme>
