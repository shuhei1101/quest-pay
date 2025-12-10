import { handleAPIError } from "@/app/(core)/errorHandler";
import { FAMILY_INVITE_API_URL } from "@/app/(core)/constants";
import { devLog } from "@/app/(core)/util";
import { PostFamilyInviteRequest } from "./schema";

/** 家族招待メールをPOSTする */
export const postFamilyInvite = async (request: PostFamilyInviteRequest) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_INVITE_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }

  const data = await res.json()

  devLog("postFamilyQuestの戻り値: ", data)
}
