"use client"

import { Box, Title, Text, Stack } from "@mantine/core"
import { SettingsListItem, SettingsSection } from "./SettingsListItem"
import { 
  IconUser, 
  IconBell, 
  IconLock, 
  IconInfoCircle,
  IconMail,
  IconKey,
  IconNotification,
  IconEye,
  IconShieldCheck,
  IconFileText,
  IconShield
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { SETTINGS_URL } from "@/app/(core)/endpoints"

type SettingsListProps = {
  /** 選択中の設定項目 */
  selectedSetting: string | null
}

/** 設定一覧コンポーネント（iPhone風リスト形式） */
export const SettingsList = ({ selectedSetting }: SettingsListProps) => {
  const router = useRouter()

  return (
    <Box p="md">
      <Stack gap="md">
        {/* ページヘッダー */}
        <Box mb="md">
          <Title order={2} size="h3" mb="xs">
            設定
          </Title>
          <Text size="sm" c="dimmed">
            アカウントとアプリの設定を管理
          </Text>
        </Box>

        {/* アカウント設定セクション */}
        <SettingsSection title="アカウント">
          <SettingsListItem
            type="button"
            label="プロフィール"
            description="名前、アイコン、自己紹介を編集"
            icon={<IconUser size={20} color="var(--mantine-color-blue-6)" />}
            onClick={() => router.push(`${SETTINGS_URL}/profile`)}
          />
          <SettingsListItem
            type="value"
            label="メールアドレス"
            description="example@email.com"
            value="変更"
            icon={<IconMail size={20} color="var(--mantine-color-green-6)" />}
            onClick={() => router.push(`${SETTINGS_URL}/email`)}
          />
          <SettingsListItem
            type="button"
            label="パスワード変更"
            description="パスワードを変更します"
            icon={<IconKey size={20} color="var(--mantine-color-orange-6)" />}
            onClick={() => router.push(`${SETTINGS_URL}/password`)}
          />
        </SettingsSection>

        {/* 通知設定セクション */}
        <SettingsSection 
          title="通知"
          footer="通知を管理してお小遣いクエストの最新情報を受け取りましょう"
        >
          <SettingsListItem
            type="button"
            label="通知設定"
            description="プッシュ通知とメール通知の設定"
            icon={<IconBell size={20} color="var(--mantine-color-violet-6)" />}
            onClick={() => router.push(`${SETTINGS_URL}/notifications`)}
          />
          <SettingsListItem
            type="button"
            label="クエスト完了通知"
            description="クエスト完了時の通知設定"
            icon={<IconNotification size={20} color="var(--mantine-color-indigo-6)" />}
            onClick={() => router.push(`${SETTINGS_URL}/quest-notifications`)}
          />
        </SettingsSection>

        {/* プライバシー設定セクション */}
        <SettingsSection title="プライバシーとセキュリティ">
          <SettingsListItem
            type="button"
            label="プライバシー設定"
            description="プロフィール公開範囲、データ共有設定"
            icon={<IconEye size={20} color="var(--mantine-color-teal-6)" />}
            onClick={() => router.push(`${SETTINGS_URL}/privacy`)}
          />
          <SettingsListItem
            type="button"
            label="セキュリティ"
            description="2段階認証、ログイン履歴"
            icon={<IconShieldCheck size={20} color="var(--mantine-color-red-6)" />}
            onClick={() => router.push(`${SETTINGS_URL}/security`)}
          />
        </SettingsSection>

        {/* アプリ情報セクション */}
        <SettingsSection title="アプリ情報">
          <SettingsListItem
            type="value"
            label="バージョン"
            value="1.0.0"
            icon={<IconInfoCircle size={20} color="var(--mantine-color-gray-6)" />}
            onClick={() => router.push(`${SETTINGS_URL}/about`)}
          />
          <SettingsListItem
            type="button"
            label="利用規約"
            icon={<IconFileText size={20} color="var(--mantine-color-gray-6)" />}
            onClick={() => router.push(`${SETTINGS_URL}/terms`)}
          />
          <SettingsListItem
            type="button"
            label="プライバシーポリシー"
            icon={<IconShield size={20} color="var(--mantine-color-gray-6)" />}
            onClick={() => router.push(`${SETTINGS_URL}/policy`)}
          />
        </SettingsSection>

        {/* 危険な操作セクション */}
        <SettingsSection 
          title="アカウント管理"
          footer="この操作は取り消せません。慎重に行ってください。"
        >
          <SettingsListItem
            type="button"
            label="アカウントを削除"
            description="すべてのデータが削除されます"
            danger
            onClick={() => {
              alert("アカウント削除機能（実装予定）")
            }}
          />
        </SettingsSection>
      </Stack>
    </Box>
  )
}
