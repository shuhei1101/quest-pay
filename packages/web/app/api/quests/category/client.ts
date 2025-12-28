import { FAMILY_QUEST_API_URL, QUEST_CATEGORIES_URL, QUESTS_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import { QuestCategorySelect } from "@/drizzle/schema";


/** クエストカテゴリを取得する */
export const getQuestCategories = async () => {
  devLog("getQuestCategories.API呼び出し: ", {URL: QUEST_CATEGORIES_URL})
  // APIを実行する
  const res = await fetch(`${QUEST_CATEGORIES_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  devLog("getQuestCategories.取得データ: ", `${QUEST_CATEGORIES_URL}`)

  const data = await res.json()

  return data as QuestCategorySelect[]
}
