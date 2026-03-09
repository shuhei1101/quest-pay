"use client"

import { Button, Card, Text, Title } from "@mantine/core"
import { IconCircleX } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

export default function CancelPage() {
  const router = useRouter()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div className="flex flex-col items-center gap-6">
          <IconCircleX size={64} color="orange" />
          
          <div className="text-center">
            <Title order={2} className="mb-2">支払いがキャンセルされました</Title>
            <Text c="dimmed">
              チェックアウトがキャンセルされました。<br/>
              もう一度お試しください。
            </Text>
          </div>

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
    </div>
  )
}
