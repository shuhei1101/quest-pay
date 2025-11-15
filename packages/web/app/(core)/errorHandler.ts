import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { AppError, DatabaseError, UNKNOWN_ERROR } from "./appError"
import { HOME_URL } from "./appConstants"
import { appStorage } from "./_sessionStorage/appStorage"
import { NextResponse } from "next/server"

type ErrorResponse = {
  type: string,
  code: string,
  message: string,
  status: number
}

// サーバ内で発生した例外のハンドル
export const handleServerError = (error: any) => {
    if (error instanceof AppError) {
      const errorInfo: ErrorResponse = {
        type: error.type, 
        code: error.code, 
        message: error.message,
        status: error.status
      }
      // アプリ固有エラーのハンドル
      return NextResponse.json(errorInfo, { status: error.status });
    } else {
      // 想定外のエラー
      return NextResponse.json({ code: UNKNOWN_ERROR, message: error.message }, { status: 500 });
    }
}


// API層で発生した例外のハンドル
export const handleAPIError = async (res: Response) => {

  // エラーを取り出す
  const error: ErrorResponse = await res.json()

  // AppErrorとしてリスローする
  throw new AppError(error.code, error.status, error.message)

}

// 画面側の例外ハンドル
export const handleAppError = (error: any, router: AppRouterInstance) => {
  
  if (error instanceof AppError) {
    // ログを出力する
    console.error(`AppError: ${error.code} - ${error.message}`);

    // 次画面で表示するメッセージを登録
    appStorage.feedbackMessage.set(error.message)
    
    // 前画面がある場合、遷移する
    const parentScreen = appStorage.parentScreen.get()
    router.push(`${parentScreen ?? HOME_URL}`);
  } else {
    console.error("不明なエラー:", error);
  }
}

// データ取得例外時のハンドル
export const handleQueryError = (error: any, targetName: string) => {
  const fetchedDataName = targetName ? targetName : "データ"
  throw new DatabaseError(`${fetchedDataName}取得時にエラーが発生しました。`)
}
