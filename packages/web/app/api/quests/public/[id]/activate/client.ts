import { PUBLIC_QUEST_ACTIVATE_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import type { ActivatePublicQuestRequest } from "./route";


/** 公開クエストを有効化する */
export const activatePublicQuest = async ({request, publicQuestId}: {
  request: ActivatePublicQuestRequest,
  publicQuestId: string
}) => {
  devLog("activatePublicQuest.API呼び出し: ", {URL: PUBLIC_QUEST_ACTIVATE_API_URL(publicQuestId), request})
  // APIを実行する
  const res = await fetch(`${PUBLIC_QUEST_ACTIVATE_API_URL(publicQuestId)}`, {
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
