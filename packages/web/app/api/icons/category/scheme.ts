import { z } from "zod"
import { IconCategorySelectSchema } from "@/drizzle/schema"

/** アイコン取得レスポンススキーマ */
export const GetIconCategoriesResponseScheme = z.object({
  iconCategories: IconCategorySelectSchema.array(),
})
export type GetIconCategoriesResponse = z.infer<typeof GetIconCategoriesResponseScheme>
