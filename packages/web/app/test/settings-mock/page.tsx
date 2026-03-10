"use client"

import { Box, Container, SegmentedControl, Stack, Title, Text } from "@mantine/core"
import { useState } from "react"
import { ParentSettings } from "./_components/ParentSettings"
import { ChildSettings } from "./_components/ChildSettings"

/** 設定画面モックページ */
export default function SettingsMockPage() {
  /** 表示する設定画面のタイプ */
  const [settingsType, setSettingsType] = useState<"parent" | "child">("parent")

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* ページヘッダー */}
        <Box>
          <Title order={1} mb="xs">
            設定画面モック
          </Title>
          <Text c="dimmed">
            親と子供の設定画面のレイアウトを確認できます
          </Text>
        </Box>

        {/* 設定タイプ切り替え */}
        <SegmentedControl
          value={settingsType}
          onChange={(value) => setSettingsType(value as "parent" | "child")}
          data={[
            { label: "親の設定", value: "parent" },
            { label: "子供の設定", value: "child" },
          ]}
          fullWidth
        />

        {/* 設定画面表示 */}
        <Box style={{ minHeight: "80vh" }}>
          {settingsType === "parent" ? <ParentSettings /> : <ChildSettings />}
        </Box>
      </Stack>
    </Container>
  )
}
