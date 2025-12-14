"use client"

import { ReactNode, useEffect } from "react"
import { appStorage } from "../_sessionStorage/appStorage"
import { Toaster } from "react-hot-toast"

// トースターメッセージ表示用コンポーネント
export const FeedbackMessage = () => {
  // レンダリング時の処理
  useEffect(() => {
    // セッションストレージにメッセージがある場合、表示する
    appStorage.feedbackMessage.out()
  }, [])

  return (<Toaster />)
}
