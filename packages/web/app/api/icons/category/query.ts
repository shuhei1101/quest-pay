import { logger } from "@/app/(core)/logger"
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
    logger.debug("アイコンカテゴリ取得完了", { data })

    return data
  } catch (error) {
    logger.error("アイコンカテゴリ取得失敗", { error })
    throw new QueryError("アイコンカテゴの読み込みに失敗しました。")
  }
}
