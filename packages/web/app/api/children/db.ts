import { ChildInsert, children } from "@/drizzle/schema"
import { Db, Tx } from "@/index"

export type InsertChildEntity = Omit<ChildInsert, "id" | "createdAt" | "updatedAt">

export const insertChild = async ({db, entity}: {
  db: Db | Tx,
  entity: InsertChildEntity
}) => {
  // 子供を挿入する
  const [newChild] = await db.insert(children).values(entity).returning({ id: children.id })

  return {
    id: newChild.id
  }
}
