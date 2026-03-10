"use client"

import { Box, Accordion, Stack, Switch, TextInput, Select, Button, Group, Title, Text, NumberInput } from "@mantine/core"
import { IconUser, IconBell, IconCoin, IconUsers, IconLock } from "@tabler/icons-react"
import { useState } from "react"

/** 親用設定デザイン3: アコーディオン形式 */
export const ParentDesign3 = () => {
  const [notifications, setNotifications] = useState({
    questComplete: true,
    questAccept: true,
    comment: false,
    levelUp: true,
    email: false,
  })

  return (
    <Box p="md">
      <Stack gap="md">
        <Box>
          <Title order={2}>設定</Title>
          <Text size="sm" c="dimmed" mt="xs">
            各セクションを開いて設定を変更できます
          </Text>
        </Box>

        <Accordion variant="separated" radius="md">
          {/* プロフィール */}
          <Accordion.Item value="profile">
            <Accordion.Control icon={<IconUser size={20} />}>
              <Text fw={600}>プロフィール</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <TextInput
                  label="名前"
                  placeholder="お父さん"
                  defaultValue="お父さん"
                />
                <TextInput
                  label="メールアドレス"
                  type="email"
                  placeholder="parent@example.com"
                  defaultValue="parent@example.com"
                />
                <Select
                  label="アイコン"
                  placeholder="アイコンを選択"
                  data={[
                    { value: "user", label: "ユーザー" },
                    { value: "heart", label: "ハート" },
                  ]}
                />
                <Group justify="flex-end">
                  <Button size="sm">保存</Button>
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 通知設定 */}
          <Accordion.Item value="notification">
            <Accordion.Control icon={<IconBell size={20} />}>
              <Group justify="space-between" wrap="nowrap" style={{ flex: 1 }}>
                <Text fw={600}>通知設定</Text>
                <Text size="xs" c="dimmed">
                  5件オン
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Switch
                  label="クエスト完了通知"
                  description="子供がクエストを完了したとき"
                  checked={notifications.questComplete}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      questComplete: e.currentTarget.checked,
                    })
                  }
                />
                <Switch
                  label="クエスト受注通知"
                  description="子供がクエストを受注したとき"
                  checked={notifications.questAccept}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      questAccept: e.currentTarget.checked,
                    })
                  }
                />
                <Switch
                  label="コメント通知"
                  checked={notifications.comment}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      comment: e.currentTarget.checked,
                    })
                  }
                />
                <Switch
                  label="レベルアップ通知"
                  checked={notifications.levelUp}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      levelUp: e.currentTarget.checked,
                    })
                  }
                />
                <Switch
                  label="メール通知"
                  description="プッシュ通知に加えてメールでも受け取る"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      email: e.currentTarget.checked,
                    })
                  }
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* お小遣い設定 */}
          <Accordion.Item value="allowance">
            <Accordion.Control icon={<IconCoin size={20} />}>
              <Text fw={600}>お小遣い設定</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <NumberInput
                  label="デフォルト報酬額"
                  placeholder="100"
                  defaultValue={100}
                  min={0}
                  suffix="円"
                />
                <Select
                  label="承認設定"
                  placeholder="選択してください"
                  data={[
                    { value: "auto", label: "自動承認" },
                    { value: "manual", label: "手動承認" },
                  ]}
                  defaultValue="manual"
                />
                <Switch
                  label="定期お小遣いを有効にする"
                  description="毎月決まった日に自動的にお小遣いを付与"
                />
                <Group justify="flex-end">
                  <Button size="sm">保存</Button>
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* 家族設定 */}
          <Accordion.Item value="family">
            <Accordion.Control icon={<IconUsers size={20} />}>
              <Text fw={600}>家族設定</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <TextInput label="家族名" placeholder="田中家" defaultValue="田中家" />
                <Text size="sm" c="dimmed">
                  メンバー管理は「家族メンバー」画面から行えます
                </Text>
                <Group justify="flex-end">
                  <Button size="sm">保存</Button>
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* アカウント */}
          <Accordion.Item value="account">
            <Accordion.Control icon={<IconLock size={20} />}>
              <Text fw={600}>アカウント</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
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
                <Group justify="flex-end">
                  <Button size="sm">パスワード変更</Button>
                </Group>
                <Button color="red" variant="light" fullWidth mt="md">
                  アカウント削除
                </Button>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Box>
  )
}
