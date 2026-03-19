"use client"

import { Box, Title, Text, Stack, Paper, Divider, Group, Badge } from "@mantine/core"
import { IconAppWindow, IconBrandGithub, IconMail, IconWorld } from "@tabler/icons-react"
import { SettingsSection, SettingsListItem } from "../_components/SettingsListItem"

/** アプリ情報ページ */
export default function AboutSettingPage() {
  return (
    <Box p="md">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Box>
          <Title order={2} size="h3" mb="xs">
            アプリについて
          </Title>
          <Text size="sm" c="dimmed">
            お小遣いクエストボードのバージョン情報と詳細
          </Text>
        </Box>

        {/* アプリ情報 */}
        <Paper p="lg" withBorder>
          <Stack gap="md" align="center">
            <IconAppWindow size={64} color="var(--mantine-color-blue-6)" />
            <Title order={3} size="h4">
              お小遣いクエストボード
            </Title>
            <Badge size="lg" variant="light">
              バージョン 1.0.0
            </Badge>
            <Text size="sm" c="dimmed" ta="center">
              親がクエストを登録、子供が実行してお小遣いを獲得するアプリ
            </Text>
          </Stack>
        </Paper>

        <Divider />

        {/* 技術スタック */}
        <Box>
          <Text size="sm" fw={600} mb="md">
            技術スタック
          </Text>
          <Stack gap="xs">
            <Group>
              <Text size="sm" c="dimmed" style={{ width: "120px" }}>
                フロントエンド:
              </Text>
              <Text size="sm">Next.js + Mantine UI</Text>
            </Group>
            <Group>
              <Text size="sm" c="dimmed" style={{ width: "120px" }}>
                バックエンド:
              </Text>
              <Text size="sm">Supabase</Text>
            </Group>
            <Group>
              <Text size="sm" c="dimmed" style={{ width: "120px" }}>
                データベース:
              </Text>
              <Text size="sm">PostgreSQL</Text>
            </Group>
          </Stack>
        </Box>

        <Divider />

        {/* リンク */}
        <SettingsSection title="リンク">
          <SettingsListItem
            type="button"
            label="公式ウェブサイト"
            icon={<IconWorld size={20} color="var(--mantine-color-blue-6)" />}
            onClick={() => window.open("https://example.com", "_blank")}
          />
          <SettingsListItem
            type="button"
            label="GitHub リポジトリ"
            icon={<IconBrandGithub size={20} color="var(--mantine-color-gray-8)" />}
            onClick={() => window.open("https://github.com/example/quest-pay", "_blank")}
          />
          <SettingsListItem
            type="button"
            label="お問い合わせ"
            icon={<IconMail size={20} color="var(--mantine-color-green-6)" />}
            onClick={() => window.open("mailto:support@example.com", "_blank")}
          />
        </SettingsSection>

        {/* コピーライト */}
        <Box>
          <Text size="xs" c="dimmed" ta="center">
            © 2026 お小遣いクエストボード. All rights reserved.
          </Text>
        </Box>
      </Stack>
    </Box>
  )
}
