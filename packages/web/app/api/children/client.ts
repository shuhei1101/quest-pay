import { CHILD_API_URL, CHILDREN_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { GetChildrenResponse, PostChildRequest, PostChildResponse } from "./route";
import { logger } from "@/app/(core)/logger";

/** 子供をGETする */
export const getChildren = async () => {
  logger.debug('子供一覧API呼び出し開始', {
    url: CHILDREN_API_URL,
  })
  
  try {
    // APIを実行する
    const res = await fetch(`${CHILDREN_API_URL}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const data = await res.json()

    logger.debug('子供一覧APIレスポンス受信', {
      status: res.status,
      ok: res.ok,
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      logger.error('子供一覧APIエラー', {
        status: res.status,
        errorData: data,
      })
      throw AppError.fromResponse(data, res.status)
    }

    logger.debug('子供一覧取得完了', {
      childrenCount: data.children?.length ?? 0,
    })

    return data as GetChildrenResponse
  } catch (error) {
    logger.error('子供一覧取得中に例外発生', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

/** 子供をPOSTする */
export const postChild = async (request: PostChildRequest) => {
  logger.debug('子供登録API呼び出し開始', {
    url: CHILDREN_API_URL,
    childName: request.form.name,
  })
  
  try {
    // APIを実行する
    const res = await fetch(`${CHILDREN_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })

    logger.debug('子供登録APIレスポンス受信', {
      status: res.status,
      ok: res.ok,
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      const data = await res.json()
      logger.error('子供登録APIエラー', {
        status: res.status,
        errorData: data,
      })
      throw AppError.fromResponse(data, res.status)
    }
    const data = await res.json()

    logger.debug('子供登録完了', {
      childId: data.childId,
    })

    return data as PostChildResponse
  } catch (error) {
    logger.error('子供登録中に例外発生', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}
