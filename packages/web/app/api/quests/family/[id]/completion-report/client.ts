import { COMPLETION_REPORT_API_URL, PUBLIC_QUEST_ACTIVATE_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import type { CompleteReportRequest } from "./route";


/** 家族クエストを完了報告する */
export const completeReport = async ({request, familyQuestId}: {
  request: CompleteReportRequest,
  familyQuestId: string
}) => {
  devLog("completeReport.API呼び出し: ", {URL: COMPLETION_REPORT_API_URL(familyQuestId), request})
  // APIを実行する
  const res = await fetch(`${COMPLETION_REPORT_API_URL(familyQuestId)}`, {
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
