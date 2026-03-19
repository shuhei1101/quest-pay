"use client"

import { Box, Container, Stack, Title, Text, Paper } from "@mantine/core"

/**
 * 設定画面ルートページ
 * iPhone風リスト形式 + 2ペイン構成
 * 
 * - モバイル: シングルペイン（設定一覧→詳細画面へ遷移）
 * - PC: 2ペイン（左: 設定一覧、右: 詳細）
 */
export default function SettingsPage() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* ページヘッダー */}
        <Box>
          <Title order={1} mb="xs">
            設定
          </Title>
          <Text c="dimmed">
            アカウントとアプリの設定を管理
          </Text>
        </Box>

        {/* 初期状態メッセージ */}
        <Paper p="xl" withBorder bg="gray.0" style={{ textAlign: "center" }}>
          <Text size="lg" fw={500} c="dimmed">
            左側の設定一覧から項目を選択してください
          </Text>
        </Paper>
      </Stack>
    </Container>
  )
}
