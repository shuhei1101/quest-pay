import { FAMILY_QUEST_API_URL, PUBLIC_QUEST_DEACTIVATE_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import type { DeactivatePublicQuestRequest } from "./route";


/** 公開クエストを無効化する */
export const deactivatePublicQuest = async ({request, publicQuestId}: {
  request: DeactivatePublicQuestRequest,
  publicQuestId: string
}) => {
  devLog("deactivatePublicQuest.API呼び出し: ", {URL: PUBLIC_QUEST_DEACTIVATE_API_URL(publicQuestId), request})
  // APIを実行する
  const res = await fetch(`${PUBLIC_QUEST_DEACTIVATE_API_URL(publicQuestId)}`, {
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
