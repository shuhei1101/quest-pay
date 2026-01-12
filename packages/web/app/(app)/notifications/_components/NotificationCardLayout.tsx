"use client"

import type { NotificationSelect } from "@/drizzle/schema"
import { Badge, Card, Group, Text, Stack } from "@mantine/core"
import { IconClock, IconBell } from "@tabler/icons-react"

/** 通知カードレイアウト */
export const NotificationCardLayout = ({notification, onClick, isSelected}: {
  notification: NotificationSelect
  onClick: (notificationId: string) => void
  isSelected?: boolean
}) => {
  /** 日時をフォーマットする */
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      withBorder
      onClick={() => onClick(notification.id)}
      className={`cursor-pointer quest-card ${isSelected ? "rainbow-border" : ""}`}
    >
      <Stack gap="xs">
        {/* ヘッダー部分 */}
        <Group justify="space-between">
          <Group gap="xs">
            {/* 通知アイコン */}
            <IconBell size={20} />
            {!notification.isRead && (
              <Badge color="red" size="sm">未読</Badge>
            )}
          </Group>
          
          {/* 日時 */}
          <Group gap={4}>
            <IconClock size={14} />
            <Text size="xs" c="dimmed">
              {formatDate(notification.createdAt)}
            </Text>
          </Group>
        </Group>

        {/* メッセージプレビュー */}
        <Text size="sm" lineClamp={2}>
          {notification.message}
        </Text>
      </Stack>
    </Card>
  )
}
