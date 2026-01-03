import { NextResponse } from "next/server"
import { AppError, ErrorResponse, UNKNOWN_ERROR } from "../appError"
import { devLog } from "../../util"

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
      devLog("withRouteErrorHandling.サーバ内例外: ", error, error.path)
      return NextResponse.json(error.toResponse(), { status: error.status })
    } else {
      devLog("withRouteErrorHandling.想定外の例外: ", error, "app/(core)/error/handler/server.ts")
      // 想定外のエラー
      return NextResponse.json({
        code: UNKNOWN_ERROR, 
        message: error instanceof Error ? error.message : String(error),
      } as ErrorResponse, { status: 500 })
    }
  }
}
