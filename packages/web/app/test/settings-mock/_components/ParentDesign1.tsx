"use client"

import { Stack, Avatar, Badge } from "@mantine/core"
import { IconUser, IconBell, IconCoin, IconUsers, IconLock } from "@tabler/icons-react"
import { SettingsSection, SettingsListItem } from "./SettingsListItem"
import { useState } from "react"

/** 親用設定デザイン1: iPhone風リスト形式 */
export const ParentDesign1 = () => {
  const [notifications, setNotifications] = useState({
    questComplete: true,
    questAccept: true,
    comment: false,
    levelUp: true,
    email: false,
  })

  return (
    <Stack gap="md" p="md">
      {/* プロフィールセクション */}
      <SettingsSection>
        <SettingsListItem
          type="button"
          label="プロフィール編集"
          value="お父さん"
          icon={<Avatar size={40} color="blue" />}
          onClick={() => console.log("プロフィール編集")}
        />
      </SettingsSection>

      {/* 通知設定 */}
      <SettingsSection
        title="通知"
        footer="プッシュ通知とメール通知を管理できます"
      >
        <SettingsListItem
          type="switch"
          label="クエスト完了通知"
          description="子供がクエストを完了したとき"
          checked={notifications.questComplete}
          onSwitchChange={(checked) =>
            setNotifications({ ...notifications, questComplete: checked })
          }
        />
        <SettingsListItem
          type="switch"
          label="クエスト受注通知"
          description="子供がクエストを受注したとき"
          checked={notifications.questAccept}
          onSwitchChange={(checked) =>
            setNotifications({ ...notifications, questAccept: checked })
          }
        />
        <SettingsListItem
          type="switch"
          label="コメント通知"
          checked={notifications.comment}
          onSwitchChange={(checked) =>
            setNotifications({ ...notifications, comment: checked })
          }
        />
        <SettingsListItem
          type="switch"
          label="レベルアップ通知"
          checked={notifications.levelUp}
          onSwitchChange={(checked) =>
            setNotifications({ ...notifications, levelUp: checked })
          }
        />
        <SettingsListItem
          type="switch"
          label="メール通知"
          description="プッシュ通知に加えてメールでも受け取る"
          checked={notifications.email}
          onSwitchChange={(checked) =>
            setNotifications({ ...notifications, email: checked })
          }
        />
      </SettingsSection>

      {/* お小遣い設定 */}
      <SettingsSection title="お小遣い">
        <SettingsListItem
          type="value"
          label="デフォルト報酬額"
          value="100円"
          icon={<IconCoin size={20} />}
          onClick={() => console.log("デフォルト報酬額")}
        />
        <SettingsListItem
          type="value"
          label="承認設定"
          value="手動承認"
          onClick={() => console.log("承認設定")}
        />
        <SettingsListItem
          type="value"
          label="定期お小遣い"
          value="未設定"
          onClick={() => console.log("定期お小遣い")}
        />
      </SettingsSection>

      {/* 家族設定 */}
      <SettingsSection title="家族">
        <SettingsListItem
          type="value"
          label="家族名"
          value="田中家"
          icon={<IconUsers size={20} />}
          onClick={() => console.log("家族名")}
        />
        <SettingsListItem
          type="button"
          label="メンバー管理"
          description="子供の追加・編集・削除"
          onClick={() => console.log("メンバー管理")}
        />
      </SettingsSection>

      {/* アカウント */}
      <SettingsSection title="アカウント">
        <SettingsListItem
          type="value"
          label="メールアドレス"
          value="parent@example.com"
          icon={<IconUser size={20} />}
          onClick={() => console.log("メールアドレス")}
        />
        <SettingsListItem
          type="button"
          label="パスワード変更"
          icon={<IconLock size={20} />}
          onClick={() => console.log("パスワード変更")}
        />
      </SettingsSection>

      {/* 危険な操作 */}
      <SettingsSection>
        <SettingsListItem
          type="button"
          label="アカウント削除"
          danger
          onClick={() => console.log("アカウント削除")}
        />
      </SettingsSection>
    </Stack>
  )
}
