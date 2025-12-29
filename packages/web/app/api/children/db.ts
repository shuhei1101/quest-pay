import { ChildInsert, children } from "@/drizzle/schema"
import { Db } from "@/index"

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
