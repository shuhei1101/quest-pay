import { appStorage } from "@/app/(core)/_sessionStorage/appStorage";
import { z } from "zod";

/** DBのアイコンスキーマ */
export const IconEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  category_id: z.number(),
  size: z.number().nullable(),
})
export type IconEntity = z.infer<typeof IconEntitySchema>

// 値オブジェクト
export const Icon = z.string().nonempty({error: "アイコンは必須です。"})

// アイコン辞書スキーマ
export const IconByIdSchema = z.record(
  z.number().transform(String),
  z.custom<IconEntity>()
)
export type IconById = z.infer<typeof IconByIdSchema>
export const createIconById = (icons: IconEntity[]) => {
  // セッションストレージから取得する
  let iconById = appStorage.iconById.get()
  // 取得できなかった場合
  if (!iconById) {
    // 生成する
    iconById = Object.fromEntries(
        icons.map(icon => [icon.id, icon])
      ) as IconById
    // セッションストレージに格納する
    appStorage.iconById.set(iconById)
  }
  return iconById
}
