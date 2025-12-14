import { z } from "zod"
import { IconEntitySchema } from "./entity"

/** アイコン取得レスポンススキーマ */
export const GetIconsResponseSchema = z.object({
  icons: IconEntitySchema.array(),
})
export type GetIconsResponse = z.infer<typeof GetIconsResponseSchema>
