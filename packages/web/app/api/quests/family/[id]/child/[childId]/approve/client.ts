import { devLog } from "@/app/(core)/util"
import { AppError } from "@/app/(core)/error/appError"
import { APPROVE_REPORT_API_URL } from "@/app/(core)/endpoints"
import type { ApproveReportRequest } from "./route"

/** 報告を受領する */
export const approveReport = async ({request, familyQuestId, childId}: {
  request: ApproveReportRequest
  familyQuestId: string
  childId: string
}) => {
  devLog("approveReport.API呼び出し: ", {URL: APPROVE_REPORT_API_URL(familyQuestId, childId), request})
  
  // APIを実行する
  const res = await fetch(APPROVE_REPORT_API_URL(familyQuestId, childId), {
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
