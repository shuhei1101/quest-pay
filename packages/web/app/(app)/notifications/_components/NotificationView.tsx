"use client"

import { Button, Group, Paper, ScrollArea, Stack, Text, Title } from "@mantine/core"
import { IconCheck, IconExternalLink } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import type { NotificationSelect } from "@/drizzle/schema"

/** 通知詳細ペイン */
export const NotificationView = ({notification}: {
  notification: NotificationSelect | null
}) => {
  const router = useRouter()

  /** 遷移ハンドル */
  const handleNavigate = () => {
    if (!notification?.url) return
    router.push(notification.url)
  }

  /** 既読にするハンドル */
  const handleMarkAsRead = () => {
    // TODO: 既読処理を実装
    console.log("既読:", notification?.id)
  }

  if (!notification) {
    return (
      <Paper p="xl" h="100%" className="flex items-center justify-center">
        <Text c="dimmed">通知を選択してください</Text>
      </Paper>
    )
  }

  return (
    <Paper p="md" h="100%">
      <ScrollArea h="100%" type="auto">
        <Stack gap="lg" p="md">
          {/* ヘッダー */}
          <div>
            <Title order={3} mb="md">通知詳細</Title>
          </div>

          {/* 通知メッセージ */}
          <div>
            <Text size="sm" fw={500} mb="xs">メッセージ</Text>
            <Paper p="md" withBorder>
              <Text size="sm">
                {notification.message}
              </Text>
            </Paper>
          </div>

          {/* 作成日時 */}
          <div>
            <Text size="sm" c="dimmed">
              {new Date(notification.createdAt).toLocaleString("ja-JP")}
            </Text>
          </div>

          {/* アクションボタン */}
          <Group justify="center" gap="md">
            {/* 遷移ボタン */}
            {notification.url && (
              <Button 
                size="md" 
                radius="xl" 
                color="blue"
                leftSection={<IconExternalLink size={18} />}
                onClick={handleNavigate}
              >
                詳細を見る
              </Button>
            )}
            
            {/* 既読ボタン */}
            {!notification.isRead && (
              <Button 
                size="md" 
                radius="xl" 
                color="green"
                variant="outline"
                leftSection={<IconCheck size={18} />}
                onClick={handleMarkAsRead}
              >
                既読にする
              </Button>
            )}
          </Group>
        </Stack>
      </ScrollArea>
    </Paper>
  )
}
