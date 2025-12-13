import { handleAPIError } from "@/app/(core)/errorHandler";
import { CHILD_API_URL, CHILDREN_API_URL } from "@/app/(core)/constants";
import { PostChildRequest, PostChildResponseSchema } from "./schema";
import { devLog } from "@/app/(core)/util";

/** 家族をPOSTする */
export const postChild = async (request: PostChildRequest) => {
  devLog("postChild.実行APIエンドポイント: ", CHILDREN_API_URL)
  // APIを実行する
  const res = await fetch(`${CHILDREN_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    devLog("postChild.API実行失敗: ", res)
    await handleAPIError(res)
  }
  const data = await res

  return PostChildResponseSchema.parse(data)
}
