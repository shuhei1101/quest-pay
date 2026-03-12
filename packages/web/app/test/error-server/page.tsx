"use client"

import { Button, Center, Paper, Stack, Text, Title, Alert, Code } from "@mantine/core"
import { IconServerOff, IconHome, IconRefresh, IconBrandGithub } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { HOME_URL } from "@/app/(core)/endpoints"

/**
 * サーバー内部エラー画面モック
 */
export default function ServerErrorMock() {
  const router = useRouter()

  const handleRetry = () => {
    router.refresh()
  }

  const handleBackToHome = () => {
    router.push(HOME_URL)
  }

  const handleReportIssue = () => {
    // 実際にはGitHubのissueページなどへ遷移
    console.log("問題を報告")
  }

  return (
    <Center style={{ minHeight: "100vh", padding: "20px" }}>
      <Paper shadow="md" p="xl" withBorder style={{ maxWidth: "500px", width: "100%" }}>
        <Stack gap="lg" align="center">
          <IconServerOff size={64} color="red" />
          
          <Title order={2}>サーバーエラー</Title>
          
          <Text c="dimmed" ta="center">
            サーバー側で問題が発生しました。
            <br />
            大変申し訳ございません。技術チームに通知されました。
          </Text>

          <Alert color="red" title="エラー詳細" style={{ width: "100%" }}>
            <Stack gap="xs">
              <Text size="sm">エラーコード: <Code>INTERNAL_SERVER_ERROR</Code></Text>
              <Text size="sm">ステータス: <Code>500 Internal Server Error</Code></Text>
              <Text size="sm">トラッキングID: <Code>ERR-2026-03-12-15:30:45</Code></Text>
              <Text size="sm" mt="xs" c="dimmed">
                問題が解決しない場合は、上記のトラッキングIDをサポートにお知らせください。
              </Text>
            </Stack>
          </Alert>

          <Stack gap="sm" style={{ width: "100%" }}>
            <Button
              leftSection={<IconRefresh size={16} />}
              fullWidth
              color="red"
              onClick={handleRetry}
            >
              再試行
            </Button>
            
            <Button
              leftSection={<IconHome size={16} />}
              variant="light"
              fullWidth
              onClick={handleBackToHome}
            >
              ホームへ戻る
            </Button>

            <Button
              leftSection={<IconBrandGithub size={16} />}
              variant="subtle"
              fullWidth
              onClick={handleReportIssue}
            >
              問題を報告
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Center>
  )
}
