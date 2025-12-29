import { ParentInsert, parents } from "@/drizzle/schema"
import { Db } from "@/index"

export type InsertParentRecord = Omit<ParentInsert, "id" | "createdAt" | "updatedAt">

export const insertParent = async ({db, record}: {
  db: Db,
  record: InsertParentRecord
}) => {
  // 親を挿入する
  const [newParent] = await db.insert(parents).values(record).returning({ id: parents.id })

  return {
    id: newParent.id
  }
}
