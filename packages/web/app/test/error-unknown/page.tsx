"use client"

import { Button, Center, Paper, Stack, Text, Title, Alert } from "@mantine/core"
import { IconAlertTriangle, IconHome, IconRefresh } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { HOME_URL } from "@/app/(core)/endpoints"

/**
 * 不明なエラー画面モック（一般的なエラー）
 */
export default function UnknownErrorMock() {
  const router = useRouter()

  const handleRetry = () => {
    router.refresh()
  }

  const handleBackToHome = () => {
    router.push(HOME_URL)
  }

  return (
    <Center style={{ minHeight: "100vh", padding: "20px" }}>
      <Paper shadow="md" p="xl" withBorder style={{ maxWidth: "500px", width: "100%" }}>
        <Stack gap="lg" align="center">
          <IconAlertTriangle size={64} color="orange" />
          
          <Title order={2}>予期しないエラーが発生しました</Title>
          
          <Text c="dimmed" ta="center">
            申し訳ございません。予期しないエラーが発生しました。
            <br />
            しばらく時間をおいてから再度お試しください。
          </Text>

          <Alert color="orange" title="エラー詳細" style={{ width: "100%" }}>
            エラーコード: UNKNOWN_ERROR
            <br />
            問題が解決しない場合は、サポートにお問い合わせください。
          </Alert>

          <Stack gap="sm" style={{ width: "100%" }}>
            <Button
              leftSection={<IconRefresh size={16} />}
              fullWidth
              onClick={handleRetry}
            >
              再読み込み
            </Button>
            
            <Button
              leftSection={<IconHome size={16} />}
              variant="light"
              fullWidth
              onClick={handleBackToHome}
            >
              ホームへ戻る
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Center>
  )
}
