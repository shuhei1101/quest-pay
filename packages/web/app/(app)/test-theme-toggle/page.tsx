"use client"

import { Card, Title, Text, Stack } from "@mantine/core"
import { useTheme } from "../../(core)/_theme/useTheme"

export default function Page() {
  const { theme } = useTheme()

  return (
    <div className="p-8" style={{ backgroundColor: theme.backgroundColors.default, height: '100%' }}>
      <Stack gap="md">
        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: theme.backgroundColors.card }}>
          <Title order={1} className="mb-4" style={{ color: theme.textColors.primary }}>
            ヘッダーテーマ切り替えデモ
          </Title>
          <Text size="md" style={{ color: theme.textColors.secondary }}>
            ヘッダーの右上にあるパレットアイコンをクリックして、テーマを切り替えてください。
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: theme.backgroundColors.card }}>
          <Title order={3} className="mb-4" style={{ color: theme.textColors.primary }}>
            現在のテーマ
          </Title>
          <Text size="md" style={{ color: theme.textColors.secondary }}>
            <strong>{theme.name}</strong>
          </Text>
        </Card>
      </Stack>
    </div>
  )
}
