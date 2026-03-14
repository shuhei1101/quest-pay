import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { QuestCategorySelect } from "@/drizzle/schema"

// クエストカテゴリ辞書スキーマ
export type QuestCategoryById = Record<string, QuestCategorySelect>

/** カテゴリ辞書を作成する */
export const createQuestCategoryById = (categories: QuestCategorySelect[]) => {
  try {
    // セッションストレージから取得する
    let questCategoryById = appStorage.questCategoryById.get()
    // 取得できなかった場合
    if (!questCategoryById) {
      // 生成する
      questCategoryById = Object.fromEntries(
        categories.map(category => [String(category.id), category])
      ) as QuestCategoryById
      // セッションストレージに格納する
      appStorage.questCategoryById.set(questCategoryById)
    }
    return questCategoryById
  } catch (error) {
    throw error
  }
}
