import { handleAPIError } from "@/app/(core)/errorHandler";
import { devLog } from "@/app/(core)/util";
import { FAMILY_API_URL } from "@/app/(core)/constants";
import { PostFamilyRequest, PostFamilyResponseSchema } from "./schema";

/** 家族をPOSTする */
export const postFamily = async (request: PostFamilyRequest) => {
  // APIを実行する
  const res = await fetch(`${FAMILY_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    await handleAPIError(res)
  }

  const data = await res.json()

  devLog("postFamilyの戻り値: ", data)

  return PostFamilyResponseSchema.parse(data)
}
