import { TEMPLATE_QUEST_BY_PUBLIC_QUEST_ID_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import type { GetTemplateQuestByPublicQuestIdResponse } from "./route";

/** 公開クエストIDからテンプレートクエストを取得する */
export const getTemplateQuestByPublicQuestId = async ({publicQuestId}: {
  publicQuestId: string
}) => {
  devLog("getTemplateQuestByPublicQuestId.API呼び出し: ", {URL: TEMPLATE_QUEST_BY_PUBLIC_QUEST_ID_API_URL(publicQuestId)})
  // APIを実行する
  const res = await fetch(`${TEMPLATE_QUEST_BY_PUBLIC_QUEST_ID_API_URL(publicQuestId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  const data = await res.json()
  devLog("getTemplateQuestByPublicQuestId.取得データ: ", data)


  return data as GetTemplateQuestByPublicQuestIdResponse
}
