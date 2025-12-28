import { devLog } from "@/app/(core)/util"
import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { iconCategories } from "@/drizzle/schema"

/** 全てのアイコンカテゴリを取得する */
export const fetchIconCategories = async ({db}: {
  db: Db
}) => {
  try {
    // データを取得する
    const data = await db.select().from(iconCategories)
    devLog("fetchIconCategories.アイコンカテゴリ取得: ", data)

    return data
  } catch (error) {
    devLog("fetchIconCategories.取得例外: ", error)
    throw new QueryError("アイコンカテゴの読み込みに失敗しました。")
  }
}
