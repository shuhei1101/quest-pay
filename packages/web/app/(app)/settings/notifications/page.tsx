"use client"

import { Box, Title, Text, Stack } from "@mantine/core"
import { SettingsSection, SettingsListItem } from "../_components/SettingsListItem"
import { IconBell, IconMail, IconDeviceMobile } from "@tabler/icons-react"
import { useState } from "react"

/** 通知設定詳細ページ */
export default function NotificationsSettingPage() {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [questComplete, setQuestComplete] = useState(true)
  const [questAssigned, setQuestAssigned] = useState(true)
  const [rewardReceived, setRewardReceived] = useState(true)

  return (
    <Box p="md">
      <Stack gap="xl">
        {/* ヘッダー */}
        <Box>
          <Title order={2} size="h3" mb="xs">
            通知設定
          </Title>
          <Text size="sm" c="dimmed">
            プッシュ通知とメール通知を管理します
          </Text>
        </Box>

        {/* 通知の種類 */}
        <SettingsSection 
          title="通知方法"
          footer="複数の通知方法を有効にすることができます"
        >
          <SettingsListItem
            type="switch"
            label="プッシュ通知"
            description="アプリにプッシュ通知を送信"
            icon={<IconDeviceMobile size={20} color="var(--mantine-color-blue-6)" />}
            checked={pushEnabled}
            onSwitchChange={setPushEnabled}
          />
          <SettingsListItem
            type="switch"
            label="メール通知"
            description="登録されたメールアドレスに通知を送信"
            icon={<IconMail size={20} color="var(--mantine-color-green-6)" />}
            checked={emailEnabled}
            onSwitchChange={setEmailEnabled}
          />
        </SettingsSection>

        {/* クエスト関連通知 */}
        <SettingsSection 
          title="クエスト通知"
          footer="クエストに関する通知の設定"
        >
          <SettingsListItem
            type="switch"
            label="クエスト完了通知"
            description="子供がクエストを完了したときに通知"
            icon={<IconBell size={20} color="var(--mantine-color-violet-6)" />}
            checked={questComplete}
            onSwitchChange={setQuestComplete}
          />
          <SettingsListItem
            type="switch"
            label="クエスト割り当て通知"
            description="新しいクエストが割り当てられたときに通知"
            icon={<IconBell size={20} color="var(--mantine-color-indigo-6)" />}
            checked={questAssigned}
            onSwitchChange={setQuestAssigned}
          />
        </SettingsSection>

        {/* 報酬関連通知 */}
        <SettingsSection title="報酬通知">
          <SettingsListItem
            type="switch"
            label="報酬受け取り通知"
            description="お小遣いを受け取ったときに通知"
            icon={<IconBell size={20} color="var(--mantine-color-yellow-6)" />}
            checked={rewardReceived}
            onSwitchChange={setRewardReceived}
          />
        </SettingsSection>
      </Stack>
    </Box>
  )
}
