import { devLog } from "@/app/(core)/util"
import { AppError } from "@/app/(core)/error/appError"
import { REJECT_REPORT_API_URL } from "@/app/(core)/endpoints"
import type { RejectReportRequest } from "./route"

/** 報告を却下する */
export const rejectReport = async ({request, familyQuestId, childId}: {
  request: RejectReportRequest
  familyQuestId: string
  childId: string
}) => {
  devLog("rejectReport.API呼び出し: ", {URL: REJECT_REPORT_API_URL(familyQuestId, childId), request})
  
  // APIを実行する
  const res = await fetch(REJECT_REPORT_API_URL(familyQuestId, childId), {
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
