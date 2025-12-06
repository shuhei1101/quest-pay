import { z } from "zod";

/** DBのアイコンスキーマ */
export const IconEntitySchema = z.object({
  name: z.string(),
  category_id: z.number(),
})
export type IconEntity = z.infer<typeof IconEntitySchema>

// 値オブジェクト
export const Icon = z.string().nonempty({error: "アイコンは必須です。"})
