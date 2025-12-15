// import { z } from "zod"
// import { IconEntityScheme } from "./entity"
// import { IconCategoryEntityScheme } from "./category/entity"

// /** カテゴリ付きアイコンビュー */
// export const IconWithCategoryViewScheme = IconEntityScheme.pick({
//     id: true,
//     name: true,
//     category_id: true,
//   }).extend(IconCategoryEntityScheme.pick({
//     icon_name: true,
//     icon_size: true,
//     sort_order: true
//   }).shape
// ).extend({
//   category_name: IconCategoryEntityScheme.shape.name
// })
// export type IconWithCategoryView = z.infer<typeof IconWithCategoryViewScheme>
