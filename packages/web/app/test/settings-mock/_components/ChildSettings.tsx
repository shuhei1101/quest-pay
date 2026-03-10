"use client"

import { Stack, TextInput, Switch, Select, NumberInput, Group, Text, Divider, Progress, Badge } from "@mantine/core"
import { SettingsLayout } from "./SettingsLayout"

/** 子供用設定画面Props */
type ChildSettingsProps = {
  /** ローディング状態 */
  isLoading?: boolean
}

/** 子供用設定画面コンポーネント */
export const ChildSettings = ({ isLoading = false }: ChildSettingsProps) => {
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
            placeholder="太郎"
            description="表示名を入力してください"
            required
          />
          <Select
            label="アイコン"
            placeholder="アイコンを選択"
            data={[
              { value: "star", label: "スター" },
              { value: "flower", label: "フラワー" },
              { value: "rocket", label: "ロケット" },
              { value: "cat", label: "ネコ" },
              { value: "dog", label: "イヌ" },
            ]}
          />
          <TextInput
            label="ニックネーム"
            placeholder="クエストマスター"
            description="みんなに見えるニックネーム（任意）"
          />
          <Divider my="sm" />
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={600}>現在のレベル</Text>
              <Text size="xs" c="dimmed">あと250XPでレベル6</Text>
            </div>
            <Badge size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
              Level 5
            </Badge>
          </Group>
          <Progress value={75} size="lg" radius="xl" striped animated />
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
            label="新しいクエスト通知"
            description="新しいクエストが追加されたときに通知を受け取る"
            defaultChecked
          />
          <Switch
            label="承認・却下通知"
            description="クエストが承認または却下されたときに通知を受け取る"
            defaultChecked
          />
          <Switch
            label="コメント通知"
            description="自分のクエストにコメントがついたときに通知を受け取る"
            defaultChecked
          />
          <Switch
            label="レベルアップ通知"
            description="レベルアップしたときに通知を受け取る"
            defaultChecked
          />
          <Switch
            label="目標達成通知"
            description="貯金目標を達成したときに通知を受け取る"
            defaultChecked
          />
        </Stack>
      ),
    },
    {
      value: "goals",
      label: "目標設定",
      content: (
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            お小遣いの貯金目標を設定しましょう
          </Text>
          <TextInput
            label="目標の名前"
            placeholder="新しいゲーム"
            description="何のために貯めるか"
          />
          <NumberInput
            label="目標金額"
            placeholder="5000"
            description="貯めたい金額"
            min={0}
            suffix="円"
          />
          <Divider my="sm" />
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={600}>現在の貯金額</Text>
              <Text size="xl" fw={700} c="blue">12,500円</Text>
            </div>
          </Group>
          <Text size="sm" c="dimmed">
            目標を設定すると、ホーム画面に進捗が表示されます
          </Text>
        </Stack>
      ),
    },
    {
      value: "privacy",
      label: "プライバシー",
      content: (
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            プライバシーとセキュリティに関する設定
          </Text>
          <Switch
            label="公開クエストへの投稿を許可"
            description="自分のクエストを公開クエストとして共有できるようにする"
            defaultChecked
          />
          <Switch
            label="コメントを許可"
            description="他の人が自分の公開クエストにコメントできるようにする"
            defaultChecked
          />
          <Switch
            label="いいねを許可"
            description="他の人が自分の公開クエストにいいねできるようにする"
            defaultChecked
          />
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
          <Text size="sm" c="dimmed">
            パスワードを変更すると、次回ログイン時に新しいパスワードが必要になります
          </Text>
        </Stack>
      ),
    },
  ]

  return (
    <SettingsLayout
      title="子供の設定"
      isLoading={isLoading}
      tabs={tabs}
      showSaveButton
      onSubmit={handleSubmit}
      showCancelButton
      onCancel={handleCancel}
    />
  )
}
