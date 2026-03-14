import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { logger } from "@/app/(core)/logger"
import { QuestCategorySelect } from "@/drizzle/schema"

// クエストカテゴリ辞書スキーマ
export type QuestCategoryById = Record<string, QuestCategorySelect>

/** カテゴリ辞書を作成する */
export const createQuestCategoryById = (categories: QuestCategorySelect[]) => {
  try {
    logger.debug("createQuestCategoryById.引数: ", { categories })
    // セッションストレージから取得する
    let questCategoryById = appStorage.questCategoryById.get()
    logger.debug("クエストカテゴリ辞書取得: ", { questCategoryById })
    // 取得できなかった場合
    if (!questCategoryById) {
      // 生成する
      questCategoryById = Object.fromEntries(
        categories.map(category => [String(category.id), category])
      ) as QuestCategoryById
      logger.debug("クエストカテゴリ辞書生成: ", { questCategoryById })
      // セッションストレージに格納する
      appStorage.questCategoryById.set(questCategoryById)
    }
    return questCategoryById
  } catch (error) {
    logger.error("createQuestCategoryById.例外: ", { error })
    throw error
  }
}
