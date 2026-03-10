"use client"

import { Box, Stack, NavLink, Paper, Title, Text, Group, Button, TextInput, Select, Switch, NumberInput } from "@mantine/core"
import { IconUser, IconBell, IconCoin, IconUsers, IconLock, IconChevronRight } from "@tabler/icons-react"
import { useState } from "react"
import { useWindow } from "@/app/(core)/useConstants"

/** 親用設定デザイン4: 2カラム形式（左メニュー、右詳細） */
export const ParentDesign4 = () => {
  const [activeSection, setActiveSection] = useState("profile")
  const { isMobile } = useWindow()
  const [notifications, setNotifications] = useState({
    questComplete: true,
    questAccept: true,
    comment: false,
    levelUp: true,
    email: false,
  })

  const menuItems = [
    { id: "profile", label: "プロフィール", icon: <IconUser size={20} /> },
    { id: "notification", label: "通知設定", icon: <IconBell size={20} /> },
    { id: "allowance", label: "お小遣い", icon: <IconCoin size={20} /> },
    { id: "family", label: "家族", icon: <IconUsers size={20} /> },
    { id: "account", label: "アカウント", icon: <IconLock size={20} /> },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <Stack gap="md">
            <Title order={3}>プロフィール</Title>
            <TextInput label="名前" placeholder="お父さん" defaultValue="お父さん" />
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
            <Group justify="flex-end" mt="md">
              <Button>保存</Button>
            </Group>
          </Stack>
        )
      case "notification":
        return (
          <Stack gap="md">
            <Title order={3}>通知設定</Title>
            <Text size="sm" c="dimmed">
              受け取りたい通知を選択してください
            </Text>
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
        )
      case "allowance":
        return (
          <Stack gap="md">
            <Title order={3}>お小遣い設定</Title>
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
            <Group justify="flex-end" mt="md">
              <Button>保存</Button>
            </Group>
          </Stack>
        )
      case "family":
        return (
          <Stack gap="md">
            <Title order={3}>家族設定</Title>
            <TextInput label="家族名" placeholder="田中家" defaultValue="田中家" />
            <Text size="sm" c="dimmed">
              メンバー管理は「家族メンバー」画面から行えます
            </Text>
            <Group justify="flex-end" mt="md">
              <Button>保存</Button>
            </Group>
          </Stack>
        )
      case "account":
        return (
          <Stack gap="md">
            <Title order={3}>アカウント</Title>
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
            <Group justify="flex-end" mt="md">
              <Button>パスワード変更</Button>
            </Group>
            <Button color="red" variant="light" fullWidth mt="xl">
              アカウント削除
            </Button>
          </Stack>
        )
      default:
        return null
    }
  }

  if (isMobile) {
    // モバイルでは1カラム表示
    return (
      <Box p="md">
        <Stack gap="md">
          <Title order={2}>設定</Title>
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              label={item.label}
              leftSection={item.icon}
              rightSection={<IconChevronRight size={16} />}
              active={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </Stack>
      </Box>
    )
  }

  // PCでは2カラム表示
  return (
    <Box p="md">
      <Group align="flex-start" gap="md" wrap="nowrap">
        {/* 左メニュー */}
        <Paper p="md" withBorder style={{ width: 250, flexShrink: 0 }}>
          <Stack gap="xs">
            <Title order={4} mb="sm">
              設定
            </Title>
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                label={item.label}
                leftSection={item.icon}
                active={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
              />
            ))}
          </Stack>
        </Paper>

        {/* 右詳細 */}
        <Paper p="lg" withBorder style={{ flex: 1, minHeight: 500 }}>
          {renderContent()}
        </Paper>
      </Group>
    </Box>
  )
}
