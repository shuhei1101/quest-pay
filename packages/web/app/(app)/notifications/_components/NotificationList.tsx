"use client"

import { Paper, ScrollArea, Stack, Text, Title, LoadingOverlay } from "@mantine/core"
import { NotificationCardLayout } from "./NotificationCardLayout"
import { useNotifications } from "../_hooks/useNotifications"
import { useRouter } from "next/navigation"
import { NOTIFICATIONS_URL } from "@/app/(core)/endpoints"

/** 通知一覧 */
export const NotificationList = ({selectedId}: {
  selectedId: string | null
}) => {
  const router = useRouter()
  const { notifications, isLoading } = useNotifications()

  /** 通知をクリックしたときのハンドル */
  const handleNotificationClick = (notificationId: string) => {
    router.push(`${NOTIFICATIONS_URL}/${notificationId}`)
  }

  return (
    <Paper p="md" h="100%" pos="relative">
      {/* ロード中のオーバーレイ */}
      <LoadingOverlay 
        visible={isLoading} 
        zIndex={1000} 
        overlayProps={{ radius: "sm", blur: 2 }} 
      />
      
      <Stack h="100%" gap="md">
        {/* ヘッダー */}
        <Title order={2}>通知</Title>
        
        {/* 通知一覧 */}
        <ScrollArea flex={1}>
          <Stack gap="sm">
            {notifications.length === 0 ? (
              <Text c="dimmed" ta="center" mt="xl">
                通知はありません
              </Text>
            ) : (
              notifications.map((notification) => (
                <NotificationCardLayout
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  isSelected={selectedId === notification.id}
                />
              ))
            )}
          </Stack>
        </ScrollArea>
      </Stack>
    </Paper>
  )
}
