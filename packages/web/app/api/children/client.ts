import { CHILD_API_URL, CHILDREN_API_URL } from "@/app/(core)/endpoints";
import { logger } from "@/app/(core)/logger";
import { AppError } from "@/app/(core)/error/appError";
import type { GetChildrenResponse, PostChildRequest, PostChildResponse } from "./route";

/** 子供をGETする */
export const getChildren = async () => {
  logger.debug("子供一覧取得API呼び出し", { URL: CHILDREN_API_URL })
  // APIを実行する
  const res = await fetch(`${CHILDREN_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    throw AppError.fromResponse(data, res.status)
  }
  logger.debug("子供一覧取得完了", { data })

  return data as GetChildrenResponse
}

/** 子供をPOSTする */
export const postChild = async (request: PostChildRequest) => {
  logger.debug("子供登録API呼び出し", { URL: CHILDREN_API_URL, request })
  // APIを実行する
  const res = await fetch(`${CHILDREN_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    logger.error("子供登録API失敗", { res })
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
  const data = await res.json()
  logger.debug("子供登録完了", { data })

  return data as PostChildResponse
}
