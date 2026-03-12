"use client"

import { Box, Stack, Paper, Title, Text, Group, Switch, Select, TextInput, Progress, Badge, Avatar, Button } from "@mantine/core"
import { IconStar, IconBell, IconTarget, IconShield } from "@tabler/icons-react"
import { useState } from "react"

/** 子供用設定デザイン3: シンプルセクション形式 */
export const ChildDesign3 = () => {
  const [notifications, setNotifications] = useState({
    newQuest: true,
    approval: true,
    comment: true,
    levelUp: true,
    goalAchievement: true,
  })

  return (
    <Box p="md">
      <Stack gap="xl">
        {/* プロフィールセクション */}
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group mb="lg">
            <IconStar size={24} color="var(--mantine-color-blue-6)" />
            <Title order={3}>プロフィール</Title>
          </Group>
          <Group gap="lg" mb="md">
            <Avatar size={80} radius="xl" color="blue" />
            <Box style={{ flex: 1 }}>
              <TextInput label="名前" placeholder="太郎" defaultValue="太郎" mb="sm" />
              <Select
                label="アイコン"
                placeholder="アイコンを選択"
                data={[
                  { value: "star", label: "⭐ スター" },
                  { value: "flower", label: "🌸 フラワー" },
                  { value: "rocket", label: "🚀 ロケット" },
                ]}
                defaultValue="star"
              />
            </Box>
          </Group>
          <Box p="md" style={{ backgroundColor: "var(--mantine-color-gray-0)", borderRadius: 8 }}>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={600}>
                レベル
              </Text>
              <Badge size="lg" variant="gradient" gradient={{ from: "blue", to: "cyan" }}>
                Level 5
              </Badge>
            </Group>
            <Progress value={75} size="lg" radius="xl" striped animated mb="xs" />
            <Text size="xs" c="dimmed" ta="right">
              あと250XPでレベル6 (750 / 1000 XP)
            </Text>
          </Box>
        </Paper>

        {/* 通知セクション */}
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group mb="lg">
            <IconBell size={24} color="var(--mantine-color-orange-6)" />
            <Title order={3}>通知</Title>
          </Group>
          <Stack gap="md">
            <Switch
              label="新しいクエスト通知"
              description="新しいクエストが追加されたとき"
              checked={notifications.newQuest}
              onChange={(e) =>
                setNotifications({ ...notifications, newQuest: e.currentTarget.checked })
              }
            />
            <Switch
              label="承認・却下通知"
              description="クエストが承認または却下されたとき"
              checked={notifications.approval}
              onChange={(e) =>
                setNotifications({ ...notifications, approval: e.currentTarget.checked })
              }
            />
            <Switch
              label="コメント通知"
              checked={notifications.comment}
              onChange={(e) =>
                setNotifications({ ...notifications, comment: e.currentTarget.checked })
              }
            />
            <Switch
              label="レベルアップ通知"
              checked={notifications.levelUp}
              onChange={(e) =>
                setNotifications({ ...notifications, levelUp: e.currentTarget.checked })
              }
            />
            <Switch
              label="目標達成通知"
              checked={notifications.goalAchievement}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  goalAchievement: e.currentTarget.checked,
                })
              }
            />
          </Stack>
        </Paper>

        {/* 目標セクション */}
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group mb="lg">
            <IconTarget size={24} color="var(--mantine-color-green-6)" />
            <Title order={3}>目標</Title>
          </Group>
          <Stack gap="md">
            <TextInput
              label="目標の名前"
              placeholder="新しいゲーム"
              defaultValue="新しいゲーム"
            />
            <TextInput
              label="目標金額"
              placeholder="20000"
              defaultValue="20000"
              rightSection={<Text size="sm">円</Text>}
            />
            <Box p="md" style={{ backgroundColor: "var(--mantine-color-green-0)", borderRadius: 8 }}>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={600}>
                  現在の貯金額
                </Text>
                <Text size="xl" fw={700} c="green">
                  12,500円
                </Text>
              </Group>
              <Progress
                value={62.5}
                size="lg"
                radius="xl"
                striped
                animated
                color="green"
                mb="xs"
              />
              <Text size="xs" c="dimmed" ta="right">
                あと7,500円で目標達成！
              </Text>
            </Box>
          </Stack>
        </Paper>

        {/* プライバシーセクション */}
        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Group mb="lg">
            <IconShield size={24} color="var(--mantine-color-indigo-6)" />
            <Title order={3}>プライバシー</Title>
          </Group>
          <Stack gap="md">
            <Switch
              label="公開クエストへの投稿を許可"
              description="自分のクエストを公開クエストとして共有"
              defaultChecked
            />
            <Switch
              label="コメントを許可"
              description="他の人が自分の公開クエストにコメント"
              defaultChecked
            />
            <Switch
              label="いいねを許可"
              description="他の人が自分の公開クエストにいいね"
              defaultChecked
            />
          </Stack>
        </Paper>

        {/* 保存ボタン */}
        <Group justify="center">
          <Button size="lg" style={{ width: "200px" }}>
            保存する
          </Button>
        </Group>
      </Stack>
    </Box>
  )
}
