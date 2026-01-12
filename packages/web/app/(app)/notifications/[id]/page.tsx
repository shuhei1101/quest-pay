"use client"

import { NotificationView } from "../_components/NotificationView"
import { useNotifications } from "../_hooks/useNotifications"

/** 通知詳細画面 */
export default function Page({params}: {params: {id: string}}) {
  const { notifications } = useNotifications()
  
  /** 選択された通知を取得する */
  const selectedNotification = notifications.find(n => n.id === params.id) || null

  return <NotificationView notification={selectedNotification} />
}
