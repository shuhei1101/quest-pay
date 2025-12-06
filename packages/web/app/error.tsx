"use client"

import { useEffect } from "react"
import { appStorage } from "./(core)/_sessionStorage/appStorage"
import { Button } from "@mantine/core"
import { useRouter } from "next/navigation"
import { HOME_URL } from "./(core)/constants"

export default function ErrorPage({
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
      <h2>不明なエラーが発生しました。</h2>
      <button type="button" onClick={() => reset()}>
        再度アクセスしてください。
      </button>
    </div>
  )
}
