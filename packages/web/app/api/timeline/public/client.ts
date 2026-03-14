import { PUBLIC_TIMELINE_API_URL } from "@/app/(core)/endpoints"
import { AppError } from "@/app/(core)/error/appError"
import type { GetPublicTimelinesResponse } from "./route"
import { logger } from "@/app/(core)/logger"

/** 公開タイムラインを取得する */
export const getPublicTimelines = async () => {
  logger.debug('公開タイムラインAPI呼び出し開始', {
    url: PUBLIC_TIMELINE_API_URL,
  })
  
  try {
    // APIを実行する
    const res = await fetch(`${PUBLIC_TIMELINE_API_URL}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    logger.debug('公開タイムラインAPIレスポンス受信', {
      status: res.status,
      ok: res.ok,
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      const data = await res.json()
      logger.error('公開タイムラインAPIエラー', {
        status: res.status,
        errorData: data,
      })
      throw AppError.fromResponse(data, res.status)
    }

    const data = await res.json()
    logger.debug('公開タイムライン取得完了', {
      timelinesCount: data.timelines?.length ?? 0,
    })

    return data as GetPublicTimelinesResponse
  } catch (error) {
    logger.error('公開タイムライン取得中に例外発生', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}
