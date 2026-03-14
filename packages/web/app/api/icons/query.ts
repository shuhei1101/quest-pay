import { QueryError } from "@/app/(core)/error/appError"
import { Db } from "@/index"
import { icons } from "@/drizzle/schema"

/** 全てのアイコンとカテゴリを取得する */
export const fetchIcons = async ({db}: {
  db: Db,
}) => {
  try {
    // データを取得する
    const data = await db.select().from(icons)

      return data
  } catch (error) {
    throw new QueryError("アイコン情報の読み込みに失敗しました。")
  }
}
