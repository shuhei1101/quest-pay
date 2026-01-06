import { PUBLIC_QUEST_LIKE_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";


/** 公開クエストをいいねする */
export const likeQuest = async ({publicQuestId}: {
  publicQuestId: string
}) => {
  devLog("likeQuest.API呼び出し: ", {URL: PUBLIC_QUEST_LIKE_API_URL(publicQuestId)})
  // APIを実行する
  const res = await fetch(`${PUBLIC_QUEST_LIKE_API_URL(publicQuestId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
