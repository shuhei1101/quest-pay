import { ChildInsert, ChildSelect, ChildUpdate, children } from "@/drizzle/schema"
import { Db } from "@/index"
import { and, eq } from "drizzle-orm"

export type InsertChildRecord = Omit<ChildInsert, "id" | "createdAt" | "updatedAt">

export const insertChild = async ({db, record}: {
  db: Db,
  record: InsertChildRecord
}) => {
  // 子供を挿入する
  const [newChild] = await db.insert(children).values(record).returning({ id: children.id })

  return {
    id: newChild.id
  }
}

/** 子供を更新する */
export const updateChild = async ({db, id, updatedAt, record}: {
  db: Db
  id: ChildSelect["id"]
  updatedAt: ChildSelect["updatedAt"]
  record: ChildUpdate
}) => {
  // 子供を更新する
  await db.update(children)
    .set({
      ...record,
      updatedAt: new Date().toISOString()
    })
    .where(and(
      eq(children.id, id),
      eq(children.updatedAt, updatedAt)
    ))
}
