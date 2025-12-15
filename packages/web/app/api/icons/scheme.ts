import { z } from "zod"
import { IconEntityScheme } from "./entity"

/** アイコン取得レスポンススキーマ */
export const GetIconsResponseScheme = z.object({
  icons: IconEntityScheme.array(),
})
export type GetIconsResponse = z.infer<typeof GetIconsResponseScheme>
