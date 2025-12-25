import { z } from "zod"
import { IconSelectSchema } from "@/drizzle/schema"

/** アイコン取得レスポンススキーマ */
export const GetIconsResponseScheme = z.object({
  icons: IconSelectSchema.array(),
})
export type GetIconsResponse = z.infer<typeof GetIconsResponseScheme>
