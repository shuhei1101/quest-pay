"use client"

import { Modal, Paper, ScrollArea, Stack, Text, Title, LoadingOverlay, Badge, Group, Button } from "@mantine/core"
import { IconClock, IconBell, IconChecks } from "@tabler/icons-react"
import { useNotifications } from "../_hooks/useNotifications"
import { useRouter } from "@/app/(core)/_hooks/useRouter"
import { NotificationSelect } from "@/drizzle/schema"
import { useReadNotifications } from "../_hooks/useReadNotifications"

/** 通知モーダル */
export const NotificationModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const router = useRouter()
  const { notifications, isLoading } = useNotifications()
  const { handleReadNotifications, isLoading: isReadingAll } = useReadNotifications()

  /** 日時をフォーマットする */
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  /** 通知をクリックしたときのハンドル */
  const handleNotificationClick = (notification: NotificationSelect) => {
    // 未読の場合は既読にする
    if (!notification.isRead) {
      handleReadNotifications({
        notificationIds: [notification.id],
        updatedAt: notification.updatedAt
      })
    }
    
    // URLが設定されている場合は遷移する
    if (notification.url) {
      onClose()
      router.push(notification.url)
    }
  }

  /** 全て既読ボタン押下時のハンドル */
  const handleReadAll = () => {
    const unreadNotifications = notifications.filter(n => !n.isRead)
    if (unreadNotifications.length === 0) return
    
    // 最新の通知のupdatedAtを使用
    const updatedAt = unreadNotifications[0]?.updatedAt || new Date().toISOString()
    
    handleReadNotifications({
      notificationIds: unreadNotifications.map(n => n.id),
      updatedAt
    })
  }

  /** 未読数を取得する */
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group justify="space-between" w="100%" pr="md">
          <Title order={3}>通知</Title>
          {/* 全て既読ボタン */}
          {unreadCount > 0 && (
            <Button
              size="xs"
              variant="light"
              leftSection={<IconChecks size={16} />}
              onClick={handleReadAll}
              loading={isReadingAll}
            >
              全て既読
            </Button>
          )}
        </Group>
      }
      size="md"
      centered
    >
      <Paper pos="relative" mih={400}>
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay 
          visible={isLoading} 
          zIndex={1000} 
          overlayProps={{ radius: "sm", blur: 2 }} 
        />
        
        {/* 通知一覧 */}
        <ScrollArea h={400}>
          <Stack gap="sm">
            {notifications.length === 0 ? (
              <Text c="dimmed" ta="center" mt="xl">
                通知はありません
              </Text>
            ) : (
              notifications.map((notification) => (
                <Paper
                  key={notification.id}
                  p="md"
                  withBorder
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleNotificationClick(notification)}
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

                    {/* メッセージ */}
                    <Text size="sm">
                      {notification.message}
                    </Text>
                  </Stack>
                </Paper>
              ))
            )}
          </Stack>
        </ScrollArea>
      </Paper>
    </Modal>
  )
}
