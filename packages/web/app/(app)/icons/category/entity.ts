import { z } from "zod";

/** DBのアイコンカテゴリスキーマ */
export const IconCategoryEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  icon_name: z.string(),
  icon_size: z.number().nullish(),
  sort_order: z.number()
})
export type IconCategoryEntity = z.infer<typeof IconCategoryEntitySchema>
