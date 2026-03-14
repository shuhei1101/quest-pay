import { CHILD_API_URL, CHILDREN_API_URL, PARENT_API_URL, PARENTS_API_URL } from "@/app/(core)/endpoints";
import { logger } from "@/app/(core)/logger";
import { AppError } from "@/app/(core)/error/appError";
import type { GetParentResponse } from "./route";

/** 親をGETする */
export const getParent = async (parentId: string) => {
  logger.debug("親情報取得API呼び出し", { URL: PARENT_API_URL(parentId) })
  // APIを実行する
  const res = await fetch(`${PARENT_API_URL(parentId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) throw AppError.fromResponse(data, res.status)
    
  logger.debug("親情報取得完了", { data })

  return data as GetParentResponse
}

/** 親をPOSTする */
// export const postChild = async (request: PostChildRequest) => {
//   logger.debug("postChild.実行APIエンドポイント: ", { CHILDREN_API_URL })
//   // APIを実行する
//   const res = await fetch(`${CHILDREN_API_URL}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(request)
//   })

//   // ステータスが不正な場合、アプリ例外を発生させる
//   if (!res.ok) {
//     logger.error("postChild.API実行失敗: ", { res })
//     const data = await res.json()
//     throw AppError.fromResponse(data, res.status)
//   }
//   const data = await res

//   return PostChildResponseScheme.parse(data)
// }
