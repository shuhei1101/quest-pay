import { DatabaseError } from "@/app/(core)/error/appError"
import { devLog } from "@/app/(core)/util"
import { profileExclusiveControl } from "./dbHelper"
import { ProfileInsert, profiles } from "@/drizzle/schema"
import { Db } from "@/index"
import { eq } from "drizzle-orm"

export type InsertProfileRecord = Omit<ProfileInsert, "id" | "createdAt" | "updatedAt">

/** プロフィールを挿入する（汎用） */
export const insertProfile = async ({db, record}: {
  db: Db,
  record: InsertProfileRecord
}) => {
  try {
    // プロフィールを挿入する
    const [newProfile] = await db.insert(profiles).values(record).returning({ id: profiles.id })

    return {
      id: newProfile.id
    } 
  } catch (error) {
    devLog("insertProfile error:", error)
    throw new DatabaseError("プロフィールの作成に失敗しました。")
  }
}

export type InsertParentProfileRecord = Omit<InsertProfileRecord, "type">

/** 親プロフィールを挿入する */
export const insertParentProfile = async ({db, record}: {
  db: Db,
  record: InsertParentProfileRecord
}) => {
  try {
    // プロフィールを挿入する
    const [newProfile] = await db.insert(profiles).values({
      type: "parent",
      ...record
    }).returning({ id: profiles.id })

    return {
      id: newProfile.id
    }
  } catch (error) {
    devLog("insertParentProfile error:", error)
    throw new DatabaseError("親プロフィールの作成に失敗しました。")
  }
}

export type InsertChildProfileRecord = Omit<InsertProfileRecord, "type">

/** 子プロフィールを挿入する */
export const insertChildProfile = async ({db, record}: {
  db: Db,
  record: InsertChildProfileRecord
}) => {
  try {
    // プロフィールを挿入する
    const [newProfile] = await db.insert(profiles).values({
      type: "child",
      ...record
    }).returning({ id: profiles.id })

    return {
      id: newProfile.id
    }
  } catch (error) {
    devLog("insertChildProfile error:", error)
    throw new DatabaseError("子プロフィールの作成に失敗しました。")
  }
}

/** プロフィールとユーザを紐づける */
export const linkProfileAndUser = async ({profileId, userId, db}: {
  profileId: string,
  userId: string,
  db: Db
}) => {
  try {
    // 存在をチェックする
    const _ = await profileExclusiveControl.existsCheck({id: profileId, db})
    
    // プロフィールを更新する
    await db.update(profiles)
      .set({ userId })
      .where(eq(profiles.id, profileId))

  } catch (error) {
    devLog("linkProfileAndUser error:", error)
    throw new DatabaseError("プロフィールとユーザの紐づけに失敗しました。")
  }

}
