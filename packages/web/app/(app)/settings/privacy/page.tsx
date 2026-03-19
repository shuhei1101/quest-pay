"use client"

import { Box, Title, Text, Stack } from "@mantine/core"
import { SettingsSection, SettingsListItem } from "../_components/SettingsListItem"
import { IconLock, IconEye, IconUsers, IconShare } from "@tabler/icons-react"
import { useState } from "react"

/** プライバシー設定詳細ページ */
export default function PrivacySettingPage() {
  const [profilePublic, setProfilePublic] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [allowMessages, setAllowMessages] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)

  return (
    <Box p="md">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Box>
          <Title order={2} size="h3" mb="xs">
            プライバシー設定
          </Title>
          <Text size="sm" c="dimmed">
            プロフィールの公開範囲とデータ共有を管理します
          </Text>
        </Box>

        {/* プロフィール公開設定 */}
        <SettingsSection 
          title="プロフィール公開"
          footer="プロフィールを公開すると、他のユーザーがあなたのクエスト履歴を見ることができます"
        >
          <SettingsListItem
            type="switch"
            label="プロフィールを公開"
            description="他のユーザーがプロフィールを閲覧できるようにする"
            icon={<IconEye size={20} color="var(--mantine-color-blue-6)" />}
            checked={profilePublic}
            onSwitchChange={setProfilePublic}
          />
          <SettingsListItem
            type="switch"
            label="クエスト統計を表示"
            description="完了したクエスト数や獲得した報酬を表示"
            icon={<IconUsers size={20} color="var(--mantine-color-green-6)" />}
            checked={showStats}
            onSwitchChange={setShowStats}
          />
        </SettingsSection>

        {/* コミュニケーション設定 */}
        <SettingsSection title="コミュニケーション">
          <SettingsListItem
            type="switch"
            label="メッセージを許可"
            description="他のユーザーからメッセージを受け取る"
            icon={<IconShare size={20} color="var(--mantine-color-violet-6)" />}
            checked={allowMessages}
            onSwitchChange={setAllowMessages}
          />
        </SettingsSection>

        {/* データ共有設定 */}
        <SettingsSection 
          title="データ共有"
          footer="データを共有すると、サービス改善に役立てることができます"
        >
          <SettingsListItem
            type="switch"
            label="匿名データを共有"
            description="使用状況の匿名データを共有してサービス改善に協力"
            icon={<IconLock size={20} color="var(--mantine-color-gray-6)" />}
            checked={dataSharing}
            onSwitchChange={setDataSharing}
          />
        </SettingsSection>
      </Stack>
    </Box>
  )
}
