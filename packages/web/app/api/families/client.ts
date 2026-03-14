import { FAMILY_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { PostFamilyRequest } from "./route";
import { logger } from "@/app/(core)/logger";

/** 家族をPOSTする */
export const postFamily = async (request: PostFamilyRequest) => {
  logger.debug('家族登録API呼び出し開始', {
    url: FAMILY_API_URL,
    familyDisplayId: request.form.displayId,
    familyLocalName: request.form.localName,
  })
  
  try {
    // APIを実行する
    const res = await fetch(`${FAMILY_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })

    logger.debug('家族登録APIレスポンス受信', {
      status: res.status,
      ok: res.ok,
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      const data = await res.json()
      logger.error('家族登録APIエラー', {
        status: res.status,
        errorData: data,
      })
      throw AppError.fromResponse(data, res.status)
    }

    logger.debug('家族登録完了')
  } catch (error) {
    logger.error('家族登録中に例外発生', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}
