"use client"

import { Button } from "@mantine/core"
import { useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // レンダリング時の処理（パスが変わるたびに実行）
  useEffect(() => {
    toast.error(`${error.message}`)
  }, [])


  return (
    <>
    <div>
      <h2>不明なエラーが発生しました。</h2>
      <Button onClick={() => reset()}>
        再度アクセスしてください。
      </Button>
    </div>
    <Toaster />
    </>
  )
}
