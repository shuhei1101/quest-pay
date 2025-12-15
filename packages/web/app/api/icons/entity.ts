import { appStorage } from "@/app/(core)/_sessionStorage/appStorage";
import { devLog } from "@/app/(core)/util";
import { z } from "zod";

/** DBのアイコンスキーマ */
export const IconEntityScheme = z.object({
  id: z.number(),
  name: z.string(),
  category_id: z.number(),
  size: z.number().nullable(),
})
export type IconEntity = z.infer<typeof IconEntityScheme>

// 値オブジェクト
export const IconId = z.number({error: "アイコンは必須です。"})
export const IconColor = z.string({error: "アイコンカラーは必須です。"})

// アイコン辞書スキーマ
export const IconByIdScheme = z.record(
  z.string(),
  z.custom<IconEntity>()
)
export type IconById = z.infer<typeof IconByIdScheme>
export const createIconById = (icons: IconEntity[]) => {
  // セッションストレージから取得する
  let iconById = appStorage.iconById.get()
  devLog("アイコン辞書取得: ", iconById)
  // 取得できなかった場合
  if (!iconById) {
    // 生成する
    iconById = Object.fromEntries(
        icons.map(icon => [String(icon.id), icon])
      ) as IconById
    // セッションストレージに格納する
    appStorage.iconById.set(iconById)
  }
  return iconById
}
