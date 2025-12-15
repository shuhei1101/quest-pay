import { z } from "zod"
import { IconCategoryEntityScheme } from "./entity"

/** アイコン取得レスポンススキーマ */
export const GetIconCategoriesResponseScheme = z.object({
  iconCategories: IconCategoryEntityScheme.array(),
})
export type GetIconCategoriesResponse = z.infer<typeof GetIconCategoriesResponseScheme>
