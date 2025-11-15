"use client"

import { useEffect } from "react"
import { Button } from "@mantine/core"
import { useRouter } from "next/navigation"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"

export default function Page({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  // レンダリング時の処理
  useEffect(() => {
    // セッションストレージにメッセージがある場合、表示する
    appStorage.feedbackMessage.out()
    console.error(error)
  }, [])

  return (
    <div>
      <h2>権限エラー画面</h2>
      <button type="button" onClick={() => reset()}>
        権限のない画面にアクセスしました。
      </button>
    </div>
  )
}
