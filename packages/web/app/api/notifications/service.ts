import { DatabaseError } from "@/app/(core)/error/appError"
import { db } from "@/index"
import { updateNotification } from "./db"

/** 複数の通知を既読にする */
export const readNotifications = async ({notificationIds, updatedAt, profileId}: {
  notificationIds: string[]
  updatedAt: string
  profileId: string
}) => {
  try {
    // トランザクションで複数テーブルに挿入する
    const result = await db.transaction(async (tx) => {
      // 通知を既読にする
      for (const notificationId of notificationIds) {
        await updateNotification({db: tx, id: notificationId, updatedAt, record: {
          isRead: true,
          readAt: new Date().toISOString(),
        }})
      }

      return notificationIds
    })

    return result
  } catch (error) {
    throw new DatabaseError('通知の既読処理に失敗しました。')
  }
}
