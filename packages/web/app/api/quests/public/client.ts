import queryString from "query-string"
import { PUBLIC_QUESTS_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { GetPublicQuestsResponse } from "./route";
import { PublicQuestSearchParams } from "./query";
import { logger } from "@/app/(core)/logger";

/** 公開クエストをGETする */
export const getPublicQuests = async (params: PublicQuestSearchParams) => {
  logger.debug('公開クエスト一覧API呼び出し開始', {
    url: PUBLIC_QUESTS_API_URL,
    params,
  })
  
  try {
    // クエリストリングを生成する
    const qs = queryString.stringify(params, { arrayFormat: "none" })
    
    // APIを実行する
    const res = await fetch(`${PUBLIC_QUESTS_API_URL}?${qs}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const data = await res.json()

    logger.debug('公開クエスト一覧APIレスポンス受信', {
      status: res.status,
      ok: res.ok,
    })

    // ステータスが不正な場合、アプリ例外を発生させる
    if (!res.ok) {
      logger.error('公開クエスト一覧APIエラー', {
        status: res.status,
        errorData: data,
      })
      throw AppError.fromResponse(data, res.status)
    }

    logger.debug('公開クエスト一覧取得完了', {
      questsCount: data.rows?.length ?? 0,
      totalRecords: data.totalRecords,
    })

    return data as GetPublicQuestsResponse
  } catch (error) {
    logger.error('公開クエスト一覧取得中に例外発生', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}
