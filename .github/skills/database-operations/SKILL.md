---
name: database-operations
description: This skill should be used when implementing database operations using Drizzle ORM and Supabase. It provides guidelines for query construction, transaction handling, and best practices for database access patterns.
---

# Database Operations

## 概要

このスキルは、Drizzle ORMとSupabaseを使用したデータベース操作のベストプラクティスを提供する。低レベルクエリの使用、排他制御、トランザクション処理などの重要な技術を含む。

## メインソースファイル

### データベース
- **スキーマ定義**: `packages/web/drizzle/schema.ts`
- **Entity定義**: `packages/web/drizzle/entity.ts`
- **マイグレーション**: `packages/web/supabase/migrations/`

### DB操作
- **DB接続**: `packages/web/app/(core)/_supabase/db.ts`
- **DB Helper**: `packages/web/app/api/_db_helper/db_helper.ts`
- **各機能のdb.ts**: `packages/web/app/api/{feature}/db.ts`
- **各機能のquery.ts**: `packages/web/app/api/{feature}/query.ts`
- **各機能のservice.ts**: `packages/web/app/api/{feature}/service.ts`

## 基本原則

### 必須ルール
1. **低レベルクエリの使用**: Drizzleの低レベルクエリを使用すること
2. **高レベルクエリの禁止**: `db.query.xxx.findFirst`などは使用しないこと
3. **排他制御**: 必要な場合は`db_helper.ts`を使用すること
4. **トランザクション**: 複数テーブル更新時はトランザクションを使用すること

## Reference Files Usage

### クエリパターンを確認する場合
SELECT、INSERT、UPDATE、DELETE、JOIN、集計などの基本パターンを確認：
```
references/query_patterns.md
```

### トランザクション実装を確認する場合
トランザクション基本、実装パターン、エラーハンドリングを確認：
```
references/transaction_examples.md
```

### 最適化ガイドを確認する場合
排他制御、インデックス、クエリ最適化、パフォーマンス監視を確認：
```
references/optimization_guide.md
```

## クイックスタート

1. **基本クエリ**: `references/query_patterns.md`でSELECT/INSERT/UPDATE/DELETE確認
2. **複雑な処理**: `references/transaction_examples.md`でトランザクション確認
3. **パフォーマンス**: `references/optimization_guide.md`で最適化確認

## 実装上の注意点

### 必須パターン
- **低レベルクエリ**: `db.select().from().where()`形式を使用
- **排他制御**: `checkVersion()`を使用
- **トランザクション**: `db.transaction()`を使用
- **returning()**: INSERT/UPDATE後は必ず`.returning()`を使用

### ファイル構成
- **db.ts**: 単一テーブルの更新操作
- **query.ts**: 読み取り専用クエリ
- **service.ts**: トランザクション処理、複数テーブル更新

### よくあるエラー回避
- ❌ `db.query.xxx.findFirst`の使用
- ❌ 排他制御なしの更新
- ❌ トランザクションなしの複数テーブル更新
- ✅ 低レベルクエリ + 排他制御 + トランザクション

## ファイル構成と責務

### db.ts
- **責務**: 単一テーブルの更新操作
- **パターン**: INSERT、UPDATE、DELETE

### query.ts
- **責務**: 読み取り専用クエリ
- **パターン**: 複雑なSELECT、JOIN、集計

### service.ts
- **責務**: トランザクション処理、複数テーブル更新
- **パターン**: 複数のdb.ts、query.tsの呼び出し

## よくあるエラーと解決策

### エラー: 高レベルクエリの使用
```ts
// ❌ 避けるべき
const quest = await db.query.quests.findFirst({
  where: eq(questsTable.id, questId)
})

// ✅ 推奨
const [quest] = await db
  .select()
  .from(questsTable)
  .where(eq(questsTable.id, questId))
  .limit(1)
```

### エラー: 排他制御の欠如
```ts
// ❌ 排他制御なし（同時更新で問題が発生する可能性）
await db
  .update(questsTable)
  .set({ title: newTitle })
  .where(eq(questsTable.id, questId))

// ✅ 排他制御あり
import { checkVersion } from "@/app/api/_db_helper/db_helper"

await checkVersion(db, questsTable, questId, currentVersion)
await db
  .update(questsTable)
  .set({
    title: newTitle,
    version: currentVersion + 1,
  })
  .where(and(
    eq(questsTable.id, questId),
    eq(questsTable.version, currentVersion)
  ))
```

## References

- DBスキーマ定義: `packages/web/drizzle/schema.ts`
- DB接続設定: `app/(core)/_supabase/`
- 排他制御ヘルパー: `app/api/_db_helper/db_helper.ts`
await db
  .delete(questsTable)
  .where(eq(questsTable.family_id, familyId))
```

## ファイル構成と責務

### db.ts
- **責務**: 単一テーブルの更新操作
- **パターン**: INSERT、UPDATE、DELETE
- **注意**: 複数テーブルの更新はservice.tsで行うこと

**例**:
```ts
// db.ts
import { db } from "@/app/(core)/_supabase/db"
import { questsTable } from "@/drizzle/schema"

/** クエストを作成する */
export const createQuest = async (data: NewQuest) => {
  const [quest] = await db
    .insert(questsTable)
    .values(data)
    .returning()
  
  return quest
}

/** クエストを更新する */
export const updateQuest = async (questId: string, data: QuestUpdate) => {
  const [quest] = await db
    .update(questsTable)
    .set(data)
    .where(eq(questsTable.id, questId))
    .returning()
  
  return quest
}
```

### query.ts
- **責務**: 読み取り専用クエリ
- **パターン**: 複雑なSELECT、JOIN、集計

**例**:
```ts
// query.ts
import { db } from "@/app/(core)/_supabase/db"
import { questsTable, categoriesTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

/** 家族のクエスト一覧を取得する */
export const getFamilyQuests = async (familyId: string) => {
  const rows = await db
    .select({
      id: questsTable.id,
      title: questsTable.title,
      categoryName: categoriesTable.name,
    })
    .from(questsTable)
    .leftJoin(categoriesTable, eq(questsTable.category_id, categoriesTable.id))
    .where(eq(questsTable.family_id, familyId))
  
  return rows
}
```

### service.ts
- **責務**: トランザクション処理、複数テーブル更新
- **パターン**: 複数のdb.ts、query.tsの呼び出し

**例**:
```ts
// service.ts
import { db } from "@/app/(core)/_supabase/db"
import { createQuest } from "./db"
import { createReward } from "../rewards/db"

/** クエストと報酬を同時に作成する */
export const createQuestWithReward = async (
  questData: NewQuest,
  rewardData: NewReward
) => {
  return await db.transaction(async (tx) => {
    const quest = await createQuest(questData)
    const reward = await createReward({ ...rewardData, quest_id: quest.id })
    
    return { quest, reward }
  })
}
```

## よくあるエラーと解決策

### エラー: 高レベルクエリの使用
```ts
// ❌ 避けるべき
const quest = await db.query.quests.findFirst({
  where: eq(questsTable.id, questId)
})

// ✅ 推奨
const [quest] = await db
  .select()
  .from(questsTable)
  .where(eq(questsTable.id, questId))
  .limit(1)
```

### エラー: 排他制御の欠如
```ts
// ❌ 排他制御なし（同時更新で問題が発生する可能性）
await db
  .update(questsTable)
  .set({ title: newTitle })
  .where(eq(questsTable.id, questId))

// ✅ 排他制御あり
import { checkVersion } from "@/app/api/_db_helper/db_helper"

await checkVersion(db, questsTable, questId, currentVersion)
await db
  .update(questsTable)
  .set({
    title: newTitle,
    version: currentVersion + 1,
  })
  .where(and(
    eq(questsTable.id, questId),
    eq(questsTable.version, currentVersion)
  ))
```

## References

- DBスキーマ定義: `packages/web/drizzle/schema.ts`
- DB接続設定: `app/(core)/_supabase/`
- 排他制御ヘルパー: `app/api/_db_helper/db_helper.ts`
