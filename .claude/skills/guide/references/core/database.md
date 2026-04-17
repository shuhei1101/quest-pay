
# データベース操作 スキル

## 概要

Quest Pay プロジェクトの Drizzle ORM を使ったデータベース操作パターン。低レベルクエリ・トランザクション・楽観的ロックの実装方法を含む。

## 基本原則

### 低レベルクエリのみ使用
```typescript
// ✅ OK - 低レベルクエリ
const result = await db
  .select()
  .from(families)
  .where(eq(families.id, familyId))

// ❌ NG - db.query.xxx は使わない
const result = await db.query.families.findFirst({
  where: eq(families.id, familyId)
})
```

## ファイル構成

```
api/<feature>/
├── db.ts      ← 低レベル DB 操作（INSERT/UPDATE/DELETE）
├── query.ts   ← SELECT クエリ（読み取り専用）
└── service.ts ← ビジネスロジック（db.ts + query.ts を組み合わせる）
```

## トランザクション

```typescript
// service.ts でトランザクションを使用
const result = await db.transaction(async (tx) => {
  // 複数の操作をアトミックに実行
  const quest = await tx.insert(familyQuests).values({ ... }).returning()
  await tx.insert(familyQuestDetails).values({ questId: quest[0].id, ... })
  return quest[0]
})
```

## 楽観的ロック

```typescript
// service.ts でバージョンチェック
const checkVersion = async (tx: typeof db, questId: string, version: number) => {
  const current = await tx
    .select({ version: familyQuests.version })
    .from(familyQuests)
    .where(eq(familyQuests.id, questId))

  if (current[0]?.version !== version) {
    throw new AppError("データが更新されています。再度お試しください", 409)
  }
}

// 更新時に version をインクリメント
await tx
  .update(familyQuests)
  .set({ ...data, version: sql`${familyQuests.version} + 1` })
  .where(eq(familyQuests.id, questId))
```

## よく使う Drizzle 操作

```typescript
import { db } from "@/packages/web/drizzle/db"
import { families, familyMembers } from "@/packages/web/drizzle/schema"
import { eq, and, or, inArray, sql, desc, asc } from "drizzle-orm"

// INSERT
const inserted = await db.insert(families).values({ name, displayId }).returning()

// SELECT with JOIN
const result = await db
  .select({
    id: families.id,
    name: families.name,
    memberCount: sql<number>`count(${familyMembers.id})`
  })
  .from(families)
  .leftJoin(familyMembers, eq(families.id, familyMembers.familyId))
  .where(eq(families.id, familyId))
  .groupBy(families.id)

// UPDATE
await db
  .update(families)
  .set({ name, updatedAt: new Date() })
  .where(eq(families.id, familyId))

// DELETE
await db.delete(families).where(eq(families.id, familyId))
```

## 実装上の注意点

- `db.ts`: INSERT/UPDATE/DELETE のみ（SELECT は `query.ts` へ）
- `query.ts`: SELECT のみ（副作用なし）
- トランザクション内では `tx` を使用（`db` ではない）
- `returning()` で挿入・更新後のレコードを取得
- 大量データは `inArray()` でバッチ処理
