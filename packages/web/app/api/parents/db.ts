import { ParentInsert, parents } from "@/drizzle/schema"
import { Db, Tx } from "@/index"

export type InsertParentEntity = Omit<ParentInsert, "id" | "createdAt" | "updatedAt">

export const insertParent = async ({db, entity}: {
  db: Db | Tx,
  entity: InsertParentEntity
}) => {
  // 親を挿入する
  const [newParent] = await db.insert(parents).values(entity).returning({ id: parents.id })

  return {
    id: newParent.id
  }
}
