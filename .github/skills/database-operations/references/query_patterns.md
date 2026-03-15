(2026年3月記載)

# クエリパターン

## 基本原則

### 必須ルール
1. **低レベルクエリの使用**: Drizzleの低レベルクエリを使用すること
2. **高レベルクエリの禁止**: `db.query.xxx.findFirst`などの高レベルクエリは使用しないこと
3. **排他制御**: 必要な場合は`db_helper.ts`を使用すること
4. **トランザクション**: 複数テーブル更新時はSupabaseの`Database Functions`またはservice.tsのトランザクションを使用すること

## 読み取りクエリ（SELECT）

### 基本的な読み取り

**単一レコードの取得:**
```ts
import { db } from "@/app/(core)/_supabase/db"
import { questsTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

// 単一レコード取得
const [quest] = await db
  .select()
  .from(questsTable)
  .where(eq(questsTable.id, questId))
  .limit(1)

// レコードが存在しない場合の処理
if (!quest) {
  throw new Error("クエストが見つかりません")
}
```

**複数レコードの取得:**
```ts
import { questsTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

// 条件付き複数レコード取得
const quests = await db
  .select()
  .from(questsTable)
  .where(eq(questsTable.family_id, familyId))
```

### 複雑な読み取り（JOIN）

**LEFT JOIN:**
```ts
import { questsTable, categoriesTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

// LEFT JOINを使用
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

**INNER JOIN:**
```ts
import { questsTable, categoriesTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

// INNER JOINを使用（カテゴリが必須の場合）
const questsWithCategory = await db
  .select({
    id: questsTable.id,
    title: questsTable.title,
    categoryName: categoriesTable.name,
  })
  .from(questsTable)
  .innerJoin(categoriesTable, eq(questsTable.category_id, categoriesTable.id))
  .where(eq(questsTable.family_id, familyId))
```

**複数テーブルのJOIN:**
```ts
import { questsTable, categoriesTable, iconsTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

// 複数テーブルをJOIN
const questsWithDetails = await db
  .select({
    id: questsTable.id,
    title: questsTable.title,
    categoryName: categoriesTable.name,
    iconUrl: iconsTable.url,
  })
  .from(questsTable)
  .leftJoin(categoriesTable, eq(questsTable.category_id, categoriesTable.id))
  .leftJoin(iconsTable, eq(questsTable.icon_id, iconsTable.id))
  .where(eq(questsTable.family_id, familyId))
```

### ネストされたオブジェクトの変換

クエリ結果をネストされたオブジェクトに変換する場合は、プライベート関数を作成して変換ロジックを集約すること。

**例:**
```ts
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

### 条件付きクエリ

**複数条件（AND）:**
```ts
import { and, eq } from "drizzle-orm"

const quests = await db
  .select()
  .from(questsTable)
  .where(and(
    eq(questsTable.family_id, familyId),
    eq(questsTable.status, "active")
  ))
```

**複数条件（OR）:**
```ts
import { or, eq } from "drizzle-orm"

const quests = await db
  .select()
  .from(questsTable)
  .where(or(
    eq(questsTable.status, "active"),
    eq(questsTable.status, "pending")
  ))
```

**LIKE検索:**
```ts
import { like } from "drizzle-orm"

const quests = await db
  .select()
  .from(questsTable)
  .where(like(questsTable.title, `%${searchTerm}%`))
```

### 並び替え

**昇順:**
```ts
import { asc } from "drizzle-orm"

const quests = await db
  .select()
  .from(questsTable)
  .orderBy(asc(questsTable.created_at))
```

**降順:**
```ts
import { desc } from "drizzle-orm"

const quests = await db
  .select()
  .from(questsTable)
  .orderBy(desc(questsTable.created_at))
```

**複数カラムで並び替え:**
```ts
import { asc, desc } from "drizzle-orm"

const quests = await db
  .select()
  .from(questsTable)
  .orderBy(desc(questsTable.priority), asc(questsTable.created_at))
```

### ページネーション

**LIMIT/OFFSET:**
```ts
const page = 1
const pageSize = 20
const offset = (page - 1) * pageSize

const quests = await db
  .select()
  .from(questsTable)
  .limit(pageSize)
  .offset(offset)
```

### 集計

**COUNT:**
```ts
import { count } from "drizzle-orm"

const [result] = await db
  .select({ count: count() })
  .from(questsTable)
  .where(eq(questsTable.family_id, familyId))

const totalCount = result.count
```

**SUM:**
```ts
import { sum } from "drizzle-orm"

const [result] = await db
  .select({ total: sum(questsTable.reward) })
  .from(questsTable)
  .where(eq(questsTable.family_id, familyId))

const totalReward = result.total
```

## 挿入クエリ（INSERT）

### 基本的な挿入

**単一レコードの挿入:**
```ts
import { questsTable } from "@/drizzle/schema"

const [insertedQuest] = await db
  .insert(questsTable)
  .values({
    id: newId,
    family_id: familyId,
    title: "新しいクエスト",
    description: "説明",
  })
  .returning()
```

**複数レコードの挿入:**
```ts
const insertedQuests = await db
  .insert(questsTable)
  .values([
    { id: id1, family_id: familyId, title: "クエスト1" },
    { id: id2, family_id: familyId, title: "クエスト2" },
  ])
  .returning()
```

## 更新クエリ（UPDATE）

### 基本的な更新

**単一レコードの更新:**
```ts
import { questsTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

const [updatedQuest] = await db
  .update(questsTable)
  .set({
    title: "更新されたタイトル",
    updated_at: new Date(),
  })
  .where(eq(questsTable.id, questId))
  .returning()
```

**複数カラムの更新:**
```ts
const [updatedQuest] = await db
  .update(questsTable)
  .set({
    title: "更新されたタイトル",
    description: "更新された説明",
    status: "completed",
    updated_at: new Date(),
  })
  .where(eq(questsTable.id, questId))
  .returning()
```

## 削除クエリ（DELETE）

### 基本的な削除

**単一レコードの削除:**
```ts
import { questsTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

await db
  .delete(questsTable)
  .where(eq(questsTable.id, questId))
```

**複数レコードの削除:**
```ts
await db
  .delete(questsTable)
  .where(eq(questsTable.family_id, familyId))
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
