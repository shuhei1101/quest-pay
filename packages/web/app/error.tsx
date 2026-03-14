"use client"

import { Button, Center, Paper, Stack, Text, Title, Alert } from "@mantine/core"
import { IconAlertTriangle, IconRefresh, IconHome } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { HOME_URL } from "./(core)/endpoints"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <Center style={{ minHeight: "70vh" }}>
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
            {error.digest && (
              <>
                <br />
                Digest: {error.digest}
              </>
            )}
            <br />
            問題が解決しない場合は、サポートにお問い合わせください。
          </Alert>

          <Stack gap="sm" style={{ width: "100%" }}>
            <Button
              leftSection={<IconRefresh size={16} />}
              fullWidth
              onClick={() => reset()}
            >
              再読み込み
            </Button>
            
            <Button
              leftSection={<IconHome size={16} />}
              variant="light"
              fullWidth
              onClick={() => router.push(HOME_URL)}
            >
              ホームへ戻る
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Center>
  )
}
