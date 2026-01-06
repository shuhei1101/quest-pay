import { PUBLIC_QUEST_LIKE_COUNT_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import type { GetPublicQuestLikeCountResponse } from "./route";

/** クエストいいね数を取得する */
export const getPublicQuestLikeCount = async ({publicQuestId}: {
  publicQuestId: string
}) => {
  devLog("getPublicQuestLikeCount.API呼び出し: ", {URL: PUBLIC_QUEST_LIKE_COUNT_API_URL(publicQuestId)})
  // APIを実行する
  const res = await fetch(`${PUBLIC_QUEST_LIKE_COUNT_API_URL(publicQuestId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  const data = await res.json()
  devLog("getPublicQuestLikeCount.取得データ: ", data)


  return data as GetPublicQuestLikeCountResponse
}
