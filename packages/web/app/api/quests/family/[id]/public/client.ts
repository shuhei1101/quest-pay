import { PUBLIC_QUEST_BY_FAMILY_QUEST_ID_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import { GetPublicQuestByFamilyQuestIdResponse } from "./route";


/** 公開クエストを取得する */
export const getPublicQuestByFamilyQuestId = async ({familyQuestId}: {
  familyQuestId: string
}) => {
  devLog("getPublicQuestByFamilyQuestId.API呼び出し: ", {URL: PUBLIC_QUEST_BY_FAMILY_QUEST_ID_API_URL(familyQuestId)})
  // APIを実行する
  const res = await fetch(`${PUBLIC_QUEST_BY_FAMILY_QUEST_ID_API_URL(familyQuestId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  devLog("getPublicQuestByFamilyQuestId.取得データ: ", `${PUBLIC_QUEST_BY_FAMILY_QUEST_ID_API_URL(familyQuestId)}`)

  const data = await res.json()

  return data as GetPublicQuestByFamilyQuestIdResponse
}
