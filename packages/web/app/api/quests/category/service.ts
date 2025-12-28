import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { devLog } from "@/app/(core)/util"
import { QuestCategorySelect } from "@/drizzle/schema"

// クエストカテゴリ辞書スキーマ
export type QuestCategoryById = Record<string, QuestCategorySelect>

/** カテゴリ辞書を作成する */
export const createQuestCategoryById = (categories: QuestCategorySelect[]) => {
  // セッションストレージから取得する
  let questCategoryById = appStorage.questCategoryById.get()
  devLog("クエストカテゴリ辞書取得: ", questCategoryById)
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
}
