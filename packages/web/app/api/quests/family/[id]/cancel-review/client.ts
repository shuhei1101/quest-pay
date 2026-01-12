import { CANCEL_REVIEW_API_URL } from "@/app/(core)/endpoints"
import { devLog } from "@/app/(core)/util"
import { AppError } from "@/app/(core)/error/appError"
import type { CancelReviewRequest } from "./route"

/** 家族クエストの完了報告をキャンセルする */
export const cancelReview = async ({request, familyQuestId}: {
  request: CancelReviewRequest,
  familyQuestId: string
}) => {
  devLog("cancelReview.API呼び出し: ", {URL: CANCEL_REVIEW_API_URL(familyQuestId), request})
  // APIを実行する
  const res = await fetch(`${CANCEL_REVIEW_API_URL(familyQuestId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
