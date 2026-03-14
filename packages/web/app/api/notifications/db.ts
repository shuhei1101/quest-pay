import { DatabaseError } from "@/app/(core)/error/appError"
import { logger } from "@/app/(core)/logger"
import { NotificationInsert, notifications, NotificationSelect, NotificationUpdate } from "@/drizzle/schema"
import { Db } from "@/index"
import { notificationExclusiveControl } from "./dbHelper"
import { eq } from "drizzle-orm"

/** 通知を挿入する */
export type InsertNotificationRecord = Omit<NotificationInsert, "isRead" | "readAt">
export const insertNotification = async ({db, record}: {
  db: Db,
  record: InsertNotificationRecord
}) => {
  try {
    // 通知を挿入する
    const [newNotification] = await db.insert(notifications).values({
      ...record,
    }).returning({ id: notifications.id })
    return {
      id: newNotification.id
    } 
  } catch (error) {
    logger.error("通知登録失敗", { error })
    throw new DatabaseError("通知の登録に失敗しました。")
  }
}

/** 通知を更新する */
export const updateNotification = async ({db, record, id, updatedAt}: {
  db: Db,
  record: NotificationUpdate
  id: string
  updatedAt: string
}) => {
  try {
    // 存在チェックを行う
    const beforeNotification = await notificationExclusiveControl.existsCheck({id, db})

    // 更新日による排他チェックを行う
    await notificationExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeNotification.updatedAt,
      afterDate: updatedAt,
    })

    // 通知を更新する
    await db.update(notifications).set(record).where(eq(notifications.id, id))
    
  } catch (error) {
    logger.error("通知更新失敗", { error })
    throw new DatabaseError("通知の更新に失敗しました。")
  }
}

/** 通知を削除する */
export const deleteNotification = async ({db, id, updatedAt}: {
  db: Db,
  id: string
  updatedAt: string
}) => {
  try {
    // 存在チェックを行う
    const beforeNotification = await notificationExclusiveControl.existsCheck({id, db})

    // 更新日による排他チェックを行う
    await notificationExclusiveControl.hasAlreadyUpdated({
      beforeDate: beforeNotification.updatedAt,
      afterDate: updatedAt,
    })

    // 通知を削除する
    await db.delete(notifications).where(eq(notifications.id, id))
    
  } catch (error) {
    logger.error("通知削除失敗", { error })
    throw new DatabaseError("通知の削除に失敗しました。")
  }
}
