"use client"

import { Button } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { HOME_URL, LOGIN_URL } from "./(core)/endpoints"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  // レンダリング時の処理（パスが変わるたびに実行）
  useEffect(() => {
    toast.error(`${error.message}`)
  }, [])


  return (
    <div className="flex flex-col items-start gap-4">
      <h2>不明なエラーが発生しました。</h2>
      <div className="flex flex-col gap-2">
        <Button onClick={() => reset()}>
          再読み込み
        </Button>
        <Button onClick={() => router.push(HOME_URL)}>
          ホームへ戻る
        </Button>
        <Button onClick={() => router.push(LOGIN_URL)}>
          ログインページへ戻る
        </Button>
      </div>
    </div>
  )
}
