import { CHILD_REWARDS_API_URL, CHILD_REWARDS_COMPLETE_PAYMENT_API_URL, CHILD_REWARDS_START_PAYMENT_API_URL } from "@/app/(core)/endpoints"
import { GetRewardHistoriesResponse } from "./route"

/** 報酬履歴を取得する */
export const getRewardHistories = async ({
  childId,
  yearMonth
}: {
  childId: string
  yearMonth?: string
}): Promise<GetRewardHistoriesResponse> => {
  const url = new URL(CHILD_REWARDS_API_URL(childId), window.location.origin)
  if (yearMonth) url.searchParams.set('yearMonth', yearMonth)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error("報酬履歴の取得に失敗しました。")

  return response.json()
}

/** 支払いを開始する */
export const startPayment = async ({
  childId,
  yearMonth
}: {
  childId: string
  yearMonth: string
}) => {
  const response = await fetch(CHILD_REWARDS_START_PAYMENT_API_URL(childId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ yearMonth })
  })

  if (!response.ok) throw new Error("支払い開始に失敗しました。")

  return response.json()
}

/** 支払いを完了する */
export const completePayment = async ({
  childId,
  yearMonth
}: {
  childId: string
  yearMonth: string
}) => {
  const response = await fetch(CHILD_REWARDS_COMPLETE_PAYMENT_API_URL(childId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ yearMonth })
  })

  if (!response.ok) throw new Error("支払い完了に失敗しました。")

  return response.json()
}
