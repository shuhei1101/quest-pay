"use client"

import { Stack, Avatar, Badge, Progress, Box, Group, Text } from "@mantine/core"
import { IconUser, IconBell, IconTarget, IconLock, IconShield } from "@tabler/icons-react"
import { SettingsSection, SettingsListItem } from "./SettingsListItem"
import { useState } from "react"

/** 子供用設定デザイン1: iPhone風リスト形式 */
export const ChildDesign1 = () => {
  const [notifications, setNotifications] = useState({
    newQuest: true,
    approval: true,
    comment: true,
    levelUp: true,
    goalAchievement: true,
  })

  return (
    <Stack gap="md" p="md">
      {/* プロフィールセクション */}
      <SettingsSection>
        <Box p="md" style={{ backgroundColor: "var(--mantine-color-body)" }}>
          <Group gap="md" mb="md">
            <Avatar size={60} color="blue" />
            <Box style={{ flex: 1 }}>
              <Text fw={600} size="lg">
                太郎
              </Text>
              <Badge size="lg" variant="gradient" gradient={{ from: "blue", to: "cyan" }}>
                Level 5
              </Badge>
            </Box>
          </Group>
          <Box>
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="dimmed">
                あと250XPでレベル6
              </Text>
              <Text size="xs" c="dimmed">
                750 / 1000 XP
              </Text>
            </Group>
            <Progress value={75} size="md" radius="xl" striped animated />
          </Box>
        </Box>
        <SettingsListItem
          type="button"
          label="プロフィール編集"
          description="名前、アイコン、ニックネームを変更"
          onClick={() => console.log("プロフィール編集")}
        />
      </SettingsSection>

      {/* 通知設定 */}
      <SettingsSection title="通知" footer="大事な通知を見逃さないようにしよう">
        <SettingsListItem
          type="switch"
          label="新しいクエスト通知"
          description="新しいクエストが追加されたとき"
          icon={<IconBell size={20} color="orange" />}
          checked={notifications.newQuest}
          onSwitchChange={(checked) =>
            setNotifications({ ...notifications, newQuest: checked })
          }
        />
        <SettingsListItem
          type="switch"
          label="承認・却下通知"
          description="クエストが承認または却下されたとき"
          checked={notifications.approval}
          onSwitchChange={(checked) =>
            setNotifications({ ...notifications, approval: checked })
          }
        />
        <SettingsListItem
          type="switch"
          label="コメント通知"
          description="自分のクエストにコメントがついたとき"
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
          label="目標達成通知"
          checked={notifications.goalAchievement}
          onSwitchChange={(checked) =>
            setNotifications({ ...notifications, goalAchievement: checked })
          }
        />
      </SettingsSection>

      {/* 目標設定 */}
      <SettingsSection title="目標" footer="がんばって目標を達成しよう！">
        <SettingsListItem
          type="value"
          label="貯金目標"
          value="新しいゲーム"
          icon={<IconTarget size={20} color="green" />}
          onClick={() => console.log("貯金目標")}
        />
        <Box p="md" style={{ backgroundColor: "var(--mantine-color-body)" }}>
          <Group justify="space-between" mb={8}>
            <Text size="sm" fw={600}>
              現在の貯金額
            </Text>
            <Text size="sm" fw={600} c="blue">
              12,500円
            </Text>
          </Group>
          <Group justify="space-between" mb={4}>
            <Text size="xs" c="dimmed">
              目標: 20,000円
            </Text>
            <Text size="xs" c="dimmed">
              あと7,500円
            </Text>
          </Group>
          <Progress
            value={62.5}
            size="lg"
            radius="xl"
            striped
            animated
            color="green"
          />
        </Box>
      </SettingsSection>

      {/* プライバシー */}
      <SettingsSection title="プライバシー">
        <SettingsListItem
          type="value"
          label="公開設定"
          value="一部公開"
          icon={<IconShield size={20} />}
          onClick={() => console.log("公開設定")}
        />
      </SettingsSection>

      {/* アカウント */}
      <SettingsSection title="アカウント">
        <SettingsListItem
          type="button"
          label="パスワード変更"
          icon={<IconLock size={20} />}
          onClick={() => console.log("パスワード変更")}
        />
      </SettingsSection>
    </Stack>
  )
}
