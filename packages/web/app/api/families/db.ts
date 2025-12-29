import { ChildInsert, children, families, FamilyInsert } from "@/drizzle/schema"
import { Db } from "@/index"

export type InsertFamilyRecord = Omit<FamilyInsert, "id" | "createdAt" | "updatedAt">

export const insertFamily = async ({db, record}: {
  db: Db,
  record: InsertFamilyRecord
}) => {
  // 家族を挿入する
  const [newFamily] = await db.insert(families).values(record).returning({ id: families.id })

  return {
    id: newFamily.id
  }
}
