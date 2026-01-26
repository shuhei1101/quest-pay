"use client"

import { Button, Center, Paper, Title, Text, Alert } from "@mantine/core"
import { IconLock, IconHome, IconArrowLeft } from "@tabler/icons-react"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { LOGIN_URL } from "@/app/(core)/endpoints"
import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { useEffect } from "react"
import { FeedbackMessage } from "@/app/(core)/_components/FeedbackMessageWrapper"

export const UnauthorizedScreen = () => {
  const router = useRouter()

  /** レンダリング時の処理 */
  useEffect(() => {
    // セッションストレージにメッセージがある場合、表示する
    appStorage.feedbackMessage.out()
  }, [])

  /** ホーム画面に戻る */
  const handleBackToHome = () => {
    router.push(LOGIN_URL)
  }

  /** 前のページに戻る */
  const handleGoBack = () => {
    router.back()
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
          {/* アイコン */}
          <Center className="mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <IconLock size={40} color="#ef4444" />
            </div>
          </Center>

          {/* タイトル */}
          <div className="text-center mb-6">
            <Title order={2} className="mb-2">アクセスが制限されています</Title>
            <Text size="sm" c="dimmed">このページを表示する権限がありません</Text>
          </div>

          {/* 説明 */}
          <Alert color="red" className="mb-4">
            <Text size="sm">
              申し訳ございません。このページにアクセスする権限がありません。
              適切な権限をお持ちのアカウントでログインしてください。
            </Text>
          </Alert>

          {/* アクション */}
          <div className="flex flex-col gap-3">
            <Button fullWidth leftSection={<IconHome size={16} />} onClick={handleBackToHome}>
              ホーム画面に戻る
            </Button>
            <Button fullWidth variant="outline" leftSection={<IconArrowLeft size={16} />} onClick={handleGoBack}>
              前のページに戻る
            </Button>
          </div>

          {/* サポート */}
          <div className="mt-6 p-3 bg-gray-50 rounded">
            <Text size="xs" c="dimmed" className="mb-1">
              <strong>このエラーが繰り返し表示される場合:</strong>
            </Text>
            <Text size="xs" c="dimmed">
              お手数ですが、管理者にお問い合わせください
            </Text>
          </div>
        </Paper>
      </div>

      {/* フィードバックメッセージ */}
      <FeedbackMessage />
    </>
  )
}
