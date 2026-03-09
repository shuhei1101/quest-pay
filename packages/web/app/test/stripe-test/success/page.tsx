"use client"

import { Button, Card, Text, Title, Alert } from "@mantine/core"
import { IconCircleCheck } from "@tabler/icons-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div className="flex flex-col items-center gap-6">
          <IconCircleCheck size={64} color="green" />
          
          <div className="text-center">
            <Title order={2} className="mb-2">支払いが完了しました！</Title>
            <Text c="dimmed">
              サブスクリプションが正常にアクティブ化されました
            </Text>
          </div>

          {sessionId && (
            <Alert color="blue" className="w-full">
              <Text size="sm">セッションID: {sessionId}</Text>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button variant="light" onClick={() => router.push("/test/stripe-test")}>
              テスト画面に戻る
            </Button>
            <Button onClick={() => router.push("/home")}>
              ホームへ
            </Button>
          </div>
        </div>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-6">
        <Title order={4} className="mb-2">次のステップ</Title>
        <Text size="sm" c="dimmed">
          • Webhookが正しく受信されているか確認してください<br/>
          • Stripeダッシュボードで支払い状況を確認できます<br/>
          • テストモードのため、実際の請求は発生しません
        </Text>
      </Card>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
