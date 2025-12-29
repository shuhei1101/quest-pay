import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { devLog } from "@/app/(core)/util"
import { IconSelect } from "@/drizzle/schema"

// アイコン辞書スキーマ
export type IconById = Record<IconSelect["id"], IconSelect>
export const createIconById = (icons: IconSelect[]) => {
  // セッションストレージから取得する
  let iconById = appStorage.iconById.get()
  devLog("アイコン辞書取得: ", iconById)
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
