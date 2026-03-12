"use client"

import { useState } from "react"
import { 
  Button, Center, Paper, Stack, Text, Title, Alert, 
  Tabs, Container, Group, Box, Card, Grid, ThemeIcon,
  Divider, Badge
} from "@mantine/core"
import { 
  IconAlertTriangle, IconHome, IconRefresh, 
  IconInfoCircle, IconBug, IconMail
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { HOME_URL } from "@/app/(core)/endpoints"

/**
 * 不明なエラー画面モック（3つのレイアウトバリエーション）
 */
export default function UnknownErrorMock() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string | null>("simple")

  const handleRetry = () => {
    router.refresh()
  }

  const handleBackToHome = () => {
    router.push(HOME_URL)
  }

  return (
    <Container size="lg" py="xl">
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="simple">シンプル</Tabs.Tab>
          <Tabs.Tab value="detailed">詳細表示</Tabs.Tab>
          <Tabs.Tab value="minimal">ミニマル</Tabs.Tab>
        </Tabs.List>

        {/* シンプルレイアウト */}
        <Tabs.Panel value="simple" pt="xl">
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
        </Tabs.Panel>

        {/* 詳細レイアウト */}
        <Tabs.Panel value="detailed" pt="xl">
          <Box style={{ minHeight: "70vh" }}>
            <Paper shadow="sm" p="xl" withBorder>
              <Group justify="space-between" mb="xl">
                <Group>
                  <ThemeIcon size={48} radius="md" color="orange">
                    <IconAlertTriangle size={28} />
                  </ThemeIcon>
                  <div>
                    <Title order={2}>予期しないエラー</Title>
                    <Text size="sm" c="dimmed">エラーコード: UNKNOWN_ERROR</Text>
                  </div>
                </Group>
                <Badge size="lg" color="orange">エラー発生</Badge>
              </Group>

              <Divider mb="xl" />

              <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group mb="md">
                      <ThemeIcon color="blue" size="lg" radius="md">
                        <IconInfoCircle size={20} />
                      </ThemeIcon>
                      <Text fw={700}>エラー情報</Text>
                    </Group>
                    <Stack gap="xs">
                      <Text size="sm">予期しないエラーが発生しました。システムの一時的な問題の可能性があります。</Text>
                      <Text size="sm" c="dimmed">発生時刻: {new Date().toLocaleString("ja-JP")}</Text>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group mb="md">
                      <ThemeIcon color="red" size="lg" radius="md">
                        <IconBug size={20} />
                      </ThemeIcon>
                      <Text fw={700}>技術詳細</Text>
                    </Group>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">Status: Error</Text>
                      <Text size="sm" c="dimmed">Type: UnknownError</Text>
                      <Text size="sm" c="dimmed">Session: Active</Text>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group mb="md">
                      <ThemeIcon color="green" size="lg" radius="md">
                        <IconMail size={20} />
                      </ThemeIcon>
                      <Text fw={700}>サポート情報</Text>
                    </Group>
                    <Text size="sm" mb="md">
                      問題が解決しない場合は、以下の情報を添えてサポートにお問い合わせください。
                    </Text>
                    <Alert color="blue" variant="light">
                      エラーID: {Math.random().toString(36).substring(7).toUpperCase()}
                      <br />
                      タイムスタンプ: {Date.now()}
                    </Alert>
                  </Card>
                </Grid.Col>
              </Grid>

              <Group justify="center" mt="xl" gap="md">
                <Button
                  leftSection={<IconRefresh size={16} />}
                  onClick={handleRetry}
                  size="md"
                >
                  再読み込み
                </Button>
                
                <Button
                  leftSection={<IconHome size={16} />}
                  variant="outline"
                  onClick={handleBackToHome}
                  size="md"
                >
                  ホームへ戻る
                </Button>
              </Group>
            </Paper>
          </Box>
        </Tabs.Panel>

        {/* ミニマルレイアウト */}
        <Tabs.Panel value="minimal" pt="xl">
          <Center style={{ minHeight: "70vh" }}>
            <Stack gap="xl" align="center" style={{ maxWidth: "400px" }}>
              <Box style={{ position: "relative" }}>
                <IconAlertTriangle 
                  size={120} 
                  color="var(--mantine-color-orange-6)" 
                  style={{ opacity: 0.2 }}
                />
                <Box 
                  style={{ 
                    position: "absolute", 
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)" 
                  }}
                >
                  <IconAlertTriangle size={60} color="var(--mantine-color-orange-6)" />
                </Box>
              </Box>

              <Stack gap="xs" align="center">
                <Title order={1} ta="center">エラー</Title>
                <Text c="dimmed" ta="center">
                  予期しないエラーが発生しました
                </Text>
                <Text size="xs" c="dimmed">UNKNOWN_ERROR</Text>
              </Stack>

              <Group gap="md">
                <Button
                  leftSection={<IconRefresh size={16} />}
                  onClick={handleRetry}
                  variant="filled"
                >
                  再読み込み
                </Button>
                
                <Button
                  leftSection={<IconHome size={16} />}
                  onClick={handleBackToHome}
                  variant="subtle"
                >
                  ホームへ
                </Button>
              </Group>
            </Stack>
          </Center>
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}
