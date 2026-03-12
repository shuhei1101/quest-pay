"use client"

import { Button, Center, Paper, Stack, Text, Title, Alert, Code } from "@mantine/core"
import { IconDatabaseOff, IconHome, IconRefresh } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { HOME_URL } from "@/app/(core)/endpoints"

/**
 * データ取得エラー画面モック
 */
export default function DataErrorMock() {
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
          <IconDatabaseOff size={64} color="grape" />
          
          <Title order={2}>データの取得に失敗しました</Title>
          
          <Text c="dimmed" ta="center">
            リクエストしたデータを取得できませんでした。
            <br />
            データが存在しないか、アクセス権限がない可能性があります。
          </Text>

          <Alert color="grape" title="エラー情報" style={{ width: "100%" }}>
            <Stack gap="xs">
              <Text size="sm">エラーコード: <Code>DATA_FETCH_ERROR</Code></Text>
              <Text size="sm">ステータス: <Code>404 Not Found</Code></Text>
              <Text size="sm" mt="xs">
                このデータは削除されたか、アクセス権限がない可能性があります。
              </Text>
            </Stack>
          </Alert>

          <Stack gap="sm" style={{ width: "100%" }}>
            <Button
              leftSection={<IconRefresh size={16} />}
              fullWidth
              color="grape"
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
