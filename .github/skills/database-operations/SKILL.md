---
name: database-operations
description: This skill should be used when implementing database operations using Drizzle ORM and Supabase. It provides guidelines for query construction, transaction handling, and best practices for database access patterns.
---

# Database Operations

## Overview

このスキルは、Drizzle ORMとSupabaseを使用したデータベース操作のベストプラクティスを提供する。低レベルクエリの使用、排他制御、トランザクション処理などの重要な技術を含む。

## 基本原則

### 必須ルール
1. **低レベルクエリの使用**: Drizzleの低レベルクエリを使用すること
2. **高レベルクエリの禁止**: `db.query.xxx.findFirst`などの高レベルクエリは使用しないこと
3. **排他制御**: 必要な場合は`db_helper.ts`を使用すること
4. **トランザクション**: 複数テーブル更新時はSupabaseの`Database Functions`またはservice.tsのトランザクションを使用すること

### DB接続
- Supabase Clientを使用してDB接続を行うこと
- 接続設定は`app/(core)/_supabase/`を参照すること

## クエリパターン

### 読み取りクエリ（SELECT）

**基本的な読み取り**:
```ts
import { db } from "@/app/(core)/_supabase/db"
import { questsTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

// 単一レコードの取得
const quest = await db
  .select()
  .from(questsTable)
  .where(eq(questsTable.id, questId))
  .limit(1)

// 複数レコードの取得
const quests = await db
  .select()
  .from(questsTable)
  .where(eq(questsTable.family_id, familyId))
```

**複雑な読み取り（JOIN）**:
```ts
import { questsTable, categoriesTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

// JOINを使用した読み取り
const questsWithCategory = await db
  .select({
    id: questsTable.id,
    title: questsTable.title,
    categoryName: categoriesTable.name,
  })
  .from(questsTable)
  .leftJoin(categoriesTable, eq(questsTable.category_id, categoriesTable.id))
  .where(eq(questsTable.family_id, familyId))
```

**ネストされたオブジェクトの変換**:
```ts
// クエリ結果をネストされたオブジェクトに変換する場合は、
// プライベート関数を作成して変換ロジックを集約すること

type QuestWithCategory = {
  id: string
  title: string
  category: {
    id: string
    name: string
  } | null
}

/** クエリ結果を変換する */
const convertToQuestWithCategory = (rows: any[]): QuestWithCategory[] => {
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    category: row.categoryId ? {
      id: row.categoryId,
      name: row.categoryName,
    } : null,
  }))
}

// 使用例
const rows = await db
  .select({
    id: questsTable.id,
    title: questsTable.title,
    categoryId: categoriesTable.id,
    categoryName: categoriesTable.name,
  })
  .from(questsTable)
  .leftJoin(categoriesTable, eq(questsTable.category_id, categoriesTable.id))

const result = convertToQuestWithCategory(rows)
```

### 挿入クエリ（INSERT）

**基本的な挿入**:
```ts
import { questsTable } from "@/drizzle/schema"

// 単一レコードの挿入
const [insertedQuest] = await db
  .insert(questsTable)
  .values({
    id: newId,
    family_id: familyId,
    title: "新しいクエスト",
    description: "説明",
  })
  .returning()

// 複数レコードの挿入
const insertedQuests = await db
  .insert(questsTable)
  .values([
    { id: id1, family_id: familyId, title: "クエスト1" },
    { id: id2, family_id: familyId, title: "クエスト2" },
  ])
  .returning()
```

### 更新クエリ（UPDATE）

**基本的な更新**:
```ts
import { questsTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

// 単一レコードの更新
const [updatedQuest] = await db
  .update(questsTable)
  .set({
    title: "更新されたタイトル",
    updated_at: new Date(),
  })
  .where(eq(questsTable.id, questId))
  .returning()
```

**排他制御を伴う更新**:
```ts
import { checkVersion } from "@/app/api/_db_helper/db_helper"
import { questsTable } from "@/drizzle/schema"
import { eq, and } from "drizzle-orm"

// バージョンチェック付き更新
await checkVersion(db, questsTable, questId, currentVersion)

const [updatedQuest] = await db
  .update(questsTable)
  .set({
    title: "更新されたタイトル",
    version: currentVersion + 1,
    updated_at: new Date(),
  })
  .where(and(
    eq(questsTable.id, questId),
    eq(questsTable.version, currentVersion)
  ))
  .returning()
```

### 削除クエリ（DELETE）

**基本的な削除**:
```ts
import { questsTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

// 単一レコードの削除
await db
  .delete(questsTable)
  .where(eq(questsTable.id, questId))

// 複数レコードの削除
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
