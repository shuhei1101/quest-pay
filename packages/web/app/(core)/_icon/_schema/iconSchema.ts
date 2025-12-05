import { z } from "zod";
import { IconCategoryEntitySchema } from "./iconCategorySchema";

/** DBのアイコンスキーマ */
export const IconEntitySchema = z.object({
  name: z.string(),
  category_id: z.number(),
})
export type IconEntity = z.infer<typeof IconEntitySchema>

/** DBのアイコンスキーマ（カテゴリ付き） */
export const IconEntityWithCategoriesSchema = IconEntitySchema.extend({
  icon_categories: IconCategoryEntitySchema
})
// 型
export type IconEntityWithCategoriesEntity = z.infer<typeof IconEntityWithCategoriesSchema>

// 値オブジェクト
export const Icon = z.string().nonempty({error: "アイコンは必須です。"})
