import { ChildInsert, children, families, FamilyInsert } from "@/drizzle/schema"
import { Db, Tx } from "@/index"

export type InsertFamilyEntity = Omit<FamilyInsert, "id" | "createdAt" | "updatedAt">

export const insertFamily = async ({db, entity}: {
  db: Db | Tx,
  entity: InsertFamilyEntity
}) => {
  // 家族を挿入する
  const [newFamily] = await db.insert(families).values(entity).returning({ id: families.id })

  return {
    id: newFamily.id
  }
}
