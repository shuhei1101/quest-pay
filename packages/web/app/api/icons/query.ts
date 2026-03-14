import { logger } from "@/app/(core)/logger"
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
      logger.debug("アイコン取得完了", { data })

      return data
  } catch (error) {
    logger.error("アイコン取得失敗", { error })
    throw new QueryError("アイコン情報の読み込みに失敗しました。")
  }
}
