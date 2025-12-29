import { devLog } from "@/app/(core)/util";
import { FAMILY_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { PostFamilyRequest } from "./route";

/** 家族をPOSTする */
export const postFamily = async (request: PostFamilyRequest) => {
  devLog("postFamily.API呼び出し: ", {URL: FAMILY_API_URL, request})
  // APIを実行する
  const res = await fetch(`${FAMILY_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}
