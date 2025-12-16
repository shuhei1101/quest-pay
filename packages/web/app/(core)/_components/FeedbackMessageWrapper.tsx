"use client"

import { ReactNode, useEffect } from "react"
import { appStorage } from "../_sessionStorage/appStorage"
import { Toaster } from "react-hot-toast"
import { usePathname } from "next/navigation"

// トースターメッセージ表示用コンポーネント
export const FeedbackMessage = () => {
  /** 現在のパス */
  const pathname = usePathname()
  
  // レンダリング時の処理（パスが変わるたびに実行）
  useEffect(() => {
    // セッションストレージにメッセージがある場合、表示する
    appStorage.feedbackMessage.out()
  }, [pathname])

  return (<Toaster />)
}
