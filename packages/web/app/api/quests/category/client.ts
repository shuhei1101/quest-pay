import { FAMILY_QUEST_API_URL, QUEST_CATEGORIES_URL, QUESTS_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import { GetQuestCategoriesResponse } from "./route";


/** クエストカテゴリを取得する */
export const getQuestCategories = async () => {
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

  const data: GetQuestCategoriesResponse = await res.json()


  return data.questCategories
}
