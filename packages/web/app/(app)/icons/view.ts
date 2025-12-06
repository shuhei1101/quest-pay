import { z } from "zod"
import { IconEntitySchema } from "./entity"
import { IconCategoryEntitySchema } from "./category/entity"

/** カテゴリ付きアイコンビュー */
export const IconWithCategoryViewSchema = IconEntitySchema.pick({
    name: true,
    category_id: true,
  }).extend(IconCategoryEntitySchema.pick({
    icon_name: true,
    icon_size: true,
    sort_order: true
  }).shape
).extend({
  category_name: IconCategoryEntitySchema.shape.name
})
export type IconWithCategoryView = z.infer<typeof IconWithCategoryViewSchema>
