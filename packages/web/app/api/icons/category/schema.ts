import { z } from "zod"
import { IconCategoryEntitySchema } from "./entity"

/** アイコン取得レスポンススキーマ */
export const GetIconCategoriesResponseSchema = z.object({
  iconCategories: IconCategoryEntitySchema.array(),
})
export type GetIconCategoriesResponse = z.infer<typeof GetIconCategoriesResponseSchema>
