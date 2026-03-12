"use client"

import { Button, Center, Paper, Stack, Text, Title, Alert } from "@mantine/core"
import { IconWifiOff, IconHome, IconRefresh } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { HOME_URL } from "@/app/(core)/endpoints"

/**
 * ネットワークエラー画面モック
 */
export default function NetworkErrorMock() {
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
          <IconWifiOff size={64} color="red" />
          
          <Title order={2}>ネットワーク接続エラー</Title>
          
          <Text c="dimmed" ta="center">
            インターネット接続に問題があるようです。
            <br />
            ネットワーク接続を確認してから、再度お試しください。
          </Text>

          <Alert color="red" title="接続の確認" style={{ width: "100%" }}>
            <Stack gap="xs">
              <Text size="sm">・Wi-Fiまたはモバイルデータが有効か確認してください</Text>
              <Text size="sm">・機内モードがオフになっているか確認してください</Text>
              <Text size="sm">・ルーターを再起動してみてください</Text>
            </Stack>
          </Alert>

          <Stack gap="sm" style={{ width: "100%" }}>
            <Button
              leftSection={<IconRefresh size={16} />}
              fullWidth
              color="red"
              onClick={handleRetry}
            >
              再接続を試す
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
