import { PUBLIC_QUEST_LIKE_COUNT_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { GetPublicQuestLikeCountResponse } from "./route";

/** クエストいいね数を取得する */
export const getPublicQuestLikeCount = async ({publicQuestId}: {
  publicQuestId: string
}) => {
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


  return data as GetPublicQuestLikeCountResponse
}
