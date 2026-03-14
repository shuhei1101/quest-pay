import { NextResponse } from "next/server"
import { AppError, ErrorResponse, UNKNOWN_ERROR } from "../appError"
import { logger } from "../../logger"

/** APIRouteの例外をハンドルする関数ラッパー */
export async function withRouteErrorHandling(
  fn: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // コールバックを実行する
    return await fn()
  } catch (error) {
    if (error instanceof AppError) {
      // アプリ固有エラーのハンドル
      logger.error("APIルートエラー（アプリエラー）", { 
        code: error.code, 
        message: error.message, 
        path: error.path,
        status: error.status 
      })
      return NextResponse.json(error.toResponse(), { status: error.status })
    } else {
      logger.error("APIルートエラー（想定外）", { 
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        path: "app/(core)/error/handler/server.ts"
      })
      // 想定外のエラー
      return NextResponse.json({
        code: UNKNOWN_ERROR, 
        message: error instanceof Error ? error.message : String(error),
      } as ErrorResponse, { status: 500 })
    }
  }
}
