import { logger } from "@/app/(core)/logger";
import { QueryError } from "@/app/(core)/error/appError";
import { Db } from "@/index";
import { questCategories } from "@/drizzle/schema";

/** 全てのクエストカテゴリを取得する */
export const fetchQuestCategories = async ({db}: {
  db: Db
}) => {
  try {
    // データを取得する
    const data = await db
      .select()
      .from(questCategories)
    
    logger.debug("fetchQuestCategories.取得クエストカテゴリ: ", { data })

    return data
  } catch (error) {
    logger.error("fetchQuestCategories.取得例外: ", { error })
    throw new QueryError("クエストカテゴリの読み込みに失敗しました。")
  }
}
