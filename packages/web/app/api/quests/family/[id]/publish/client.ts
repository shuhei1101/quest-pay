import { FAMILY_QUEST_PUBLISH_API_URL, QUESTS_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";


/** 家族クエストを公開する
 * 家族クエストから公開クエストを作成する
 */
export const publishFamilyQuestPublic = async ({familyQuestId}: {
  familyQuestId: string
}) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_QUEST_PUBLISH_API_URL(familyQuestId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
