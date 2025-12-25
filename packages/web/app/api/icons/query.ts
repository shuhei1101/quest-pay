import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db, Tx } from "@/index"
import { icons } from "@/drizzle/schema"

/** 全てのアイコンとカテゴリを取得する */
export const fetchIcons = async ({db}: {
  db: Db | Tx,
}) => {
  try {
    // データを取得する
    const data = await db.select().from(icons)
      devLog("fetchIcons.アイコン取得: ", data)

      return data
  } catch (error) {
    devLog("fetchIcons.取得例外: ", error)
    throw new QueryError("アイコン情報の読み込みに失敗しました。")
  }
}
