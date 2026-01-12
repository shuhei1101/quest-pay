import { and, desc, eq } from "drizzle-orm"
import { Db } from "@/index"
import { notifications, NotificationSelect } from "@/drizzle/schema"
import { devLog } from "@/app/(core)/util"
import { DatabaseError } from "@/app/(core)/error/appError"

/** 自身の通知を全件取得する */
export const fetchNotifications = async ({db, profileId}: {
  db: Db
  profileId: string
}) => {
  try {
  const notificationList = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.recipientProfileId, profileId))) // プロフィールIDに一致するもの
    .orderBy(desc(notifications.createdAt)) // 作成日の降順でソート

  return notificationList
  } catch (error) {
    devLog("fetchNotifications error:", error)
    throw new DatabaseError("通知一覧の取得に失敗しました。")
  }
}

/** 通知を取得する */
export const fetchNotification = async ({id, db}: {
  id: NotificationSelect["id"],
  db: Db
}) => {
  try{ 
  const data = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, id))

  return data[0]
  } catch (error) {
    devLog("fetchNotification error:", error)
    throw new DatabaseError("通知の取得に失敗しました。")
  }
}
