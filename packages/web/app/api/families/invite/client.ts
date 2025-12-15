import { FAMILY_INVITE_API_URL } from "@/app/(core)/constants";
import { devLog } from "@/app/(core)/util";
import { PostFamilyInviteRequest } from "./scheme";
import { AppError } from "@/app/(core)/error/appError";

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
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }

  const data = await res.json()

  devLog("postFamilyQuest.戻り値: ", data)
}
