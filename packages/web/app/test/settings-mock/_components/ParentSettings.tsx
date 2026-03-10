"use client"

import { Stack, TextInput, Switch, Select, Textarea, NumberInput, Group, Text, Divider } from "@mantine/core"
import { SettingsLayout } from "./SettingsLayout"

/** 親用設定画面Props */
type ParentSettingsProps = {
  /** ローディング状態 */
  isLoading?: boolean
}

/** 親用設定画面コンポーネント */
export const ParentSettings = ({ isLoading = false }: ParentSettingsProps) => {
  /** フォーム送信ハンドラ */
  const handleSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault()
    console.log("設定を保存しました")
  }

  /** キャンセルハンドラ */
  const handleCancel = () => {
    console.log("キャンセルしました")
  }

  /** タブ設定 */
  const tabs = [
    {
      value: "profile",
      label: "プロフィール",
      content: (
        <Stack gap="md">
          <TextInput
            label="名前"
            placeholder="お父さん"
            description="表示名を入力してください"
            required
          />
          <TextInput
            label="メールアドレス"
            type="email"
            placeholder="parent@example.com"
            description="ログインに使用するメールアドレス"
            required
          />
          <Select
            label="アイコン"
            placeholder="アイコンを選択"
            data={[
              { value: "user", label: "ユーザー" },
              { value: "heart", label: "ハート" },
              { value: "star", label: "スター" },
            ]}
          />
          <Textarea
            label="自己紹介"
            placeholder="よろしくお願いします"
            description="子供たちに向けたメッセージを入力できます"
            minRows={3}
          />
        </Stack>
      ),
    },
    {
      value: "notification",
      label: "通知設定",
      content: (
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            受け取りたい通知を選択してください
          </Text>
          <Switch
            label="クエスト完了通知"
            description="子供がクエストを完了したときに通知を受け取る"
            defaultChecked
          />
          <Switch
            label="クエスト受注通知"
            description="子供がクエストを受注したときに通知を受け取る"
            defaultChecked
          />
          <Switch
            label="コメント通知"
            description="クエストにコメントがついたときに通知を受け取る"
          />
          <Switch
            label="レベルアップ通知"
            description="子供がレベルアップしたときに通知を受け取る"
            defaultChecked
          />
          <Divider my="sm" />
          <Switch
            label="メール通知を有効にする"
            description="プッシュ通知に加えて、メールでも通知を受け取る"
          />
        </Stack>
      ),
    },
    {
      value: "allowance",
      label: "お小遣い設定",
      content: (
        <Stack gap="md">
          <NumberInput
            label="デフォルト報酬額"
            placeholder="100"
            description="新しいクエストを作成するときのデフォルト報酬額"
            min={0}
            suffix="円"
          />
          <Select
            label="承認設定"
            placeholder="選択してください"
            description="クエスト完了時の承認フロー"
            data={[
              { value: "auto", label: "自動承認" },
              { value: "manual", label: "手動承認" },
            ]}
            defaultValue="manual"
          />
          <Switch
            label="定期お小遣いを有効にする"
            description="毎月決まった日に自動的にお小遣いを付与する"
          />
          <NumberInput
            label="定期お小遣い額"
            placeholder="1000"
            description="毎月付与するお小遣いの額"
            min={0}
            suffix="円"
            disabled
          />
          <Select
            label="付与日"
            placeholder="選択してください"
            description="お小遣いを付与する日"
            data={Array.from({ length: 31 }, (_, i) => ({
              value: String(i + 1),
              label: `毎月${i + 1}日`,
            }))}
            disabled
          />
        </Stack>
      ),
    },
    {
      value: "family",
      label: "家族設定",
      content: (
        <Stack gap="md">
          <TextInput
            label="家族名"
            placeholder="田中家"
            description="家族の表示名"
            required
          />
          <Textarea
            label="家族の説明"
            placeholder="楽しい家族です"
            description="家族についての説明（任意）"
            minRows={2}
          />
          <Divider my="sm" />
          <Text size="sm" fw={600}>
            メンバー管理
          </Text>
          <Text size="sm" c="dimmed">
            子供の追加・編集・削除は「家族メンバー」画面から行えます
          </Text>
        </Stack>
      ),
    },
    {
      value: "account",
      label: "アカウント",
      content: (
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            アカウントとセキュリティに関する設定
          </Text>
          <TextInput
            label="現在のパスワード"
            type="password"
            placeholder="••••••••"
          />
          <TextInput
            label="新しいパスワード"
            type="password"
            placeholder="••••••••"
          />
          <TextInput
            label="新しいパスワード（確認）"
            type="password"
            placeholder="••••••••"
          />
          <Divider my="sm" />
          <Group>
            <Text size="sm" c="red" fw={600}>
              危険な操作
            </Text>
          </Group>
          <Text size="sm" c="dimmed">
            アカウントを削除すると、すべてのデータが失われます
          </Text>
        </Stack>
      ),
    },
  ]

  return (
    <SettingsLayout
      title="親の設定"
      isLoading={isLoading}
      tabs={tabs}
      showSaveButton
      onSubmit={handleSubmit}
      showCancelButton
      onCancel={handleCancel}
    />
  )
}
